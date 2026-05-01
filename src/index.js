const ResolverModule = require('@forge/resolver');
const Resolver = ResolverModule.default || ResolverModule;
const api = require('@forge/api');
const { storage, route } = api;

const resolver = new Resolver();

const FIELD_STORAGE_KEY = 'traceability:fields';
const CONFIG_STORAGE_KEY = 'traceability:config';
const ENHANCED_MATRIX_STATE_PREFIX = 'traceability:enhanced-matrix-state:';
const ENHANCED_MATRIX_LAST_STATE_KEY = 'traceability:enhanced-matrix-last-state';

const MAX_ISSUES = 2000;
const PAGE_SIZE = 100;
const CACHE_TTL_MS = 60 * 1000;
const MATRIX_CACHE_MAX = 20;

const FIELD_DEFS = [
  {
    name: 'Affected Components',
    description: 'Tracey: UI views or system components touched by this issue',
    type: 'com.atlassian.jira.plugin.system.customfieldtypes:labels',
    searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:labelsearcher',
  },
  {
    name: 'User Roles',
    description: 'Tracey: user roles impacted by this issue',
    type: 'com.atlassian.jira.plugin.system.customfieldtypes:labels',
    searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:labelsearcher',
  },
  {
    name: 'Permissions',
    description: 'Tracey: permissions affected by this issue',
    type: 'com.atlassian.jira.plugin.system.customfieldtypes:labels',
    searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:labelsearcher',
  },
  {
    name: 'DB Entities',
    description: 'Tracey: database entities touched by this issue',
    type: 'com.atlassian.jira.plugin.system.customfieldtypes:labels',
    searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:labelsearcher',
  },
  {
    name: 'Use cases',
    description: 'Tracey: use cases impacted by this issue',
    type: 'com.atlassian.jira.plugin.system.customfieldtypes:labels',
    searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:labelsearcher',
  },
];

const FIELD_NAMES = {
  AFFECTED_COMPONENTS: 'Affected Components',
  USER_ROLES: 'User Roles',
  PERMISSIONS: 'Permissions',
  DB_ENTITIES: 'DB Entities',
  USE_CASES: 'Use cases',
};

const STORY_LINK_PRIORITY = ['blocks', 'duplicates', 'clones', 'relates'];
const STORY_LINK_STYLE = {
  blocks: { colorHex: '#D32F2F' },
  duplicates: { colorHex: '#7B1FA2' },
  clones: { colorHex: '#FBC02D' },
  relates: { colorHex: '#9E9E9E' },
};

const matrixCache = new Map();

resolver.define('getIssueTypes', async () => {
  const data = await requestJiraJson(route`/rest/api/3/issuetype`);
  return (data || []).map((type) => ({
    id: type.id,
    name: type.name,
    subtask: type.subtask,
    hierarchyLevel: type.hierarchyLevel,
  }));
});

resolver.define('getEpics', async ({ payload }) => {
  const { projectKey } = payload || {};
  if (!projectKey) {
    throw new Error('Project key is required.');
  }

  const epicTypeNames = await getEpicIssueTypeNames();
  const epicTypeClause =
    epicTypeNames.length > 0
      ? `issuetype in (${epicTypeNames.map(quoteJql).join(', ')})`
      : `issuetype = "Epic"`;
  const jql = `project = ${quoteJql(projectKey)} AND ${epicTypeClause}`;
  const fields = ['summary', 'status'];

  const { issues } = await searchIssues(jql, fields);
  return issues
    .map((issue) => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status?.name || null,
    }))
    .sort((a, b) => sortStrings(a.key, b.key));
});

resolver.define('getFixedVersions', async ({ payload }) => {
  const { projectKey } = payload || {};
  if (!projectKey) {
    throw new Error('Project key is required.');
  }

  const project = await requestJiraJson(route`/rest/api/3/project/${projectKey}`);
  const projectId = project?.id ? String(project.id) : null;
  const versions = await requestJiraJson(route`/rest/api/3/project/${projectKey}/versions`);
  const seenVersionNames = new Set();

  return (versions || [])
    .map((version) => ({
      id: version.id,
      name: version.name,
      released: Boolean(version.released),
      archived: Boolean(version.archived),
      projectId: version.projectId != null ? String(version.projectId) : null,
    }))
    .filter((version) => Boolean(version.name))
    .filter((version) => {
      if (!projectId || !version.projectId) {
        return true;
      }
      return version.projectId === projectId;
    })
    .filter((version) => {
      const normalizedName = normalizeName(version.name);
      if (!normalizedName || seenVersionNames.has(normalizedName)) {
        return false;
      }
      seenVersionNames.add(normalizedName);
      return true;
    })
    .map(({ projectId: _ignoredProjectId, ...version }) => version)
    .sort((a, b) => sortStrings(a.name, b.name));
});

resolver.define('getProjectLabels', async ({ payload }) => {
  const { projectKey } = payload || {};
  if (!projectKey) {
    throw new Error('Project key is required.');
  }

  const jql = `project = ${quoteJql(projectKey)}`;
  const { issues } = await searchIssues(jql, ['labels']);
  const labels = new Set();
  for (const issue of issues || []) {
    for (const label of issue.fields?.labels || []) {
      if (label) {
        labels.add(String(label));
      }
    }
  }
  return Array.from(labels).sort(sortStrings);
});

resolver.define('getProjectComponents', async ({ payload }) => {
  const { projectKey } = payload || {};
  if (!projectKey) {
    throw new Error('Project key is required.');
  }

  const fieldMap = await getFieldMap();
  const componentFieldId = fieldMap[FIELD_NAMES.AFFECTED_COMPONENTS];
  if (!componentFieldId) {
    return [];
  }

  const jql = `project = ${quoteJql(projectKey)}`;
  const { issues } = await searchIssues(jql, [componentFieldId]);
  const components = new Set();

  for (const issue of issues || []) {
    for (const component of toArray(issue.fields?.[componentFieldId])) {
      const normalized = String(component || '').trim();
      if (normalized) {
        components.add(normalized);
      }
    }
  }

  return Array.from(components).sort(sortStrings);
});

resolver.define('getLinkTypes', async () => {
  const data = await requestJiraJson(route`/rest/api/3/issueLinkType`);
  return (data.issueLinkTypes || []).map((linkType) => ({
    id: linkType.id,
    name: linkType.name,
    inward: linkType.inward,
    outward: linkType.outward,
  }));
});

resolver.define('getFieldInfo', async () => {
  const fieldMap = await getFieldMap();
  return fieldMap;
});

resolver.define('ensureCustomFields', async () => {
  const fieldMap = await ensureCustomFields();
  return fieldMap;
});

resolver.define('getConfig', async () => {
  const config = await getConfig();
  return config;
});

resolver.define('setConfig', async ({ payload }) => {
  const nextConfig = payload || {};
  await storage.set(CONFIG_STORAGE_KEY, nextConfig);
  return { ok: true };
});

resolver.define('setEnhancedMatrixState', async ({ payload }) => {
  const { projectKey, state } = payload || {};
  if (!projectKey) {
    throw new Error('Project key is required.');
  }
  const key = `${ENHANCED_MATRIX_STATE_PREFIX}${projectKey}`;
  const normalizedState = {
    projectKey,
    ...(state || {}),
  };
  await storage.set(key, normalizedState);
  await storage.set(ENHANCED_MATRIX_LAST_STATE_KEY, normalizedState);
  return { ok: true };
});

resolver.define('getEnhancedMatrixState', async ({ payload }) => {
  const { projectKey } = payload || {};
  if (!projectKey) {
    throw new Error('Project key is required.');
  }
  const key = `${ENHANCED_MATRIX_STATE_PREFIX}${projectKey}`;
  return (await storage.get(key)) || null;
});

resolver.define('getEnhancedMatrixLastState', async () => {
  return (await storage.get(ENHANCED_MATRIX_LAST_STATE_KEY)) || null;
});

resolver.define('getMatrixData', async ({ payload }) => {
  const { projectKey, mode, issueTypes, epicKeys, fixedVersions, labels, components, jql, sprint } = payload || {};
  if (!projectKey) {
    throw new Error('Project key is required.');
  }

  const normalizedEpicKeys = dedupe((epicKeys || []).map((value) => String(value).trim()).filter(Boolean)).sort(sortStrings);
  const normalizedFixedVersions = dedupe((fixedVersions || []).map((value) => String(value).trim()).filter(Boolean)).sort(sortStrings);
  const normalizedLabels = dedupe((labels || []).map((value) => String(value).trim()).filter(Boolean)).sort(sortStrings);
  const normalizedComponents = dedupe((components || []).map((value) => String(value).trim()).filter(Boolean)).sort(sortStrings);
  const cacheKey = JSON.stringify({
    projectKey,
    mode,
    issueTypes,
    epicKeys: normalizedEpicKeys,
    fixedVersions: normalizedFixedVersions,
    labels: normalizedLabels,
    components: normalizedComponents,
    jql,
    sprint,
  });
  const cached = getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const fieldMap = await getFieldMap();
  const epicLinkFieldId = await getEpicLinkFieldId();
  const jqlQuery = buildJql({
    projectKey,
    issueTypes,
    fixedVersions: normalizedFixedVersions,
    labels: normalizedLabels,
    components: normalizedComponents,
    componentFieldId: fieldMap[FIELD_NAMES.AFFECTED_COMPONENTS],
    jql,
    sprint,
  });
  const fields = [
    'summary',
    'issuetype',
    'status',
    'priority',
    'fixVersions',
    'labels',
    'parent',
    'issuelinks',
    fieldMap[FIELD_NAMES.AFFECTED_COMPONENTS],
    fieldMap[FIELD_NAMES.USE_CASES],
    fieldMap[FIELD_NAMES.USER_ROLES],
    fieldMap[FIELD_NAMES.PERMISSIONS],
    fieldMap[FIELD_NAMES.DB_ENTITIES],
    epicLinkFieldId,
  ].filter(Boolean);

  const { issues: queriedIssues, total, truncated } = await searchIssues(jqlQuery, fields);
  const epicFilteredIssues = filterIssuesByEpicKeys(queriedIssues, normalizedEpicKeys, epicLinkFieldId);
  const issues = filterIssuesByComponents(
    epicFilteredIssues,
    normalizedComponents,
    fieldMap[FIELD_NAMES.AFFECTED_COMPONENTS]
  );

  const config = await getConfig();

  let matrix;
  if (mode === 'hierarchical') {
    matrix = buildHierarchicalView(issues);
  } else if (mode === 'components') {
    matrix = buildComponentsMatrix(issues, fieldMap);
  } else if (mode === 'story-to-story') {
    matrix = buildStoryToStoryMatrix(issues, config);
  } else if (mode === 'story') {
    matrix = await buildStoryMatrix(issues, fieldMap, config);
  } else {
    matrix = buildUseCaseMatrix(issues, fieldMap);
  }

  const result = {
    ...matrix,
    jql: jqlQuery,
    totalIssues: total,
    truncated,
    issueCount: issues.length,
  };

  setCache(cacheKey, result);
  return result;
});

resolver.define('getIssuePanelData', async ({ payload }) => {
  const { issueKey } = payload || {};
  if (!issueKey) {
    throw new Error('Issue key is required.');
  }

  const fieldMap = await getFieldMap();
  const fields = [
    'summary',
    'issuetype',
    'issuelinks',
    fieldMap[FIELD_NAMES.AFFECTED_COMPONENTS],
    fieldMap[FIELD_NAMES.USER_ROLES],
    fieldMap[FIELD_NAMES.PERMISSIONS],
    fieldMap[FIELD_NAMES.DB_ENTITIES],
    fieldMap[FIELD_NAMES.USE_CASES],
  ].filter(Boolean);

  const issue = await requestJiraJson(
    route`/rest/api/3/issue/${issueKey}?fields=${fields.join(',')}`
  );

  const linkGroups = await groupIssueLinks(issue.fields.issuelinks || []);

  const fieldValues = [
    FIELD_NAMES.AFFECTED_COMPONENTS,
    FIELD_NAMES.USER_ROLES,
    FIELD_NAMES.PERMISSIONS,
    FIELD_NAMES.DB_ENTITIES,
    FIELD_NAMES.USE_CASES,
  ].map((name) => ({
    name,
    values: toArray(issue.fields[fieldMap[name]]),
  }));

  const filledFields = fieldValues.filter((field) => field.values.length > 0).length;

  return {
    issueKey: issue.key,
    issueSummary: issue.fields.summary,
    issueType: issue.fields.issuetype?.name,
    fieldValues,
    linkGroups,
    completeness: {
      filledFields,
      totalFields: fieldValues.length,
      linkedIssueCount: linkGroups.reduce((sum, group) => sum + group.issues.length, 0),
    },
  };
});

resolver.define('assignIssueParent', async ({ payload }) => {
  const { issueKey, parentKey } = payload || {};
  if (!issueKey || !parentKey) {
    throw new Error('Both issueKey and parentKey are required.');
  }
  if (issueKey === parentKey) {
    throw new Error('Issue cannot be parent of itself.');
  }

  try {
    await requestJiraJson(route`/rest/api/3/issue/${issueKey}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        fields: {
          parent: { key: parentKey },
        },
      }),
    });
  } catch (error) {
    if (!canFallbackToEpicLink(error)) {
      throw error;
    }

    const epicLinkFieldId = await getEpicLinkFieldId();
    if (!epicLinkFieldId) {
      throw error;
    }

    const parentIssue = await requestJiraJson(
      route`/rest/api/3/issue/${parentKey}?fields=issuetype`
    );
    const parentIssueTypeName = parentIssue?.fields?.issuetype?.name || '';
    if (!/epic/i.test(parentIssueTypeName)) {
      throw error;
    }

    await requestJiraJson(route`/rest/api/3/issue/${issueKey}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        fields: {
          [epicLinkFieldId]: parentKey,
        },
      }),
    });
  }

  clearMatrixCache();
  return { ok: true };
});

exports.handler = resolver.getDefinitions();

exports.onInstall = async () => {
  await ensureCustomFields();
};

async function requestJiraJson(url, options = {}) {
  const response = await api.asApp().requestJira(url, options);
  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = { raw: text };
    }
  }
  if (!response.ok) {
    throw new Error(`Jira API error ${response.status}: ${text}`);
  }
  return data;
}

async function getFieldMap() {
  let fieldMap = await storage.get(FIELD_STORAGE_KEY);
  if (!fieldMap || Object.keys(fieldMap).length === 0) {
    fieldMap = await ensureCustomFields();
  }
  return fieldMap;
}

async function ensureCustomFields() {
  const existingFields = await requestJiraJson(route`/rest/api/3/field`);
  const existingByName = new Map(
    existingFields.map((field) => [normalizeName(field.name), field])
  );

  const fieldMap = {};

  for (const def of FIELD_DEFS) {
    const existing = existingByName.get(normalizeName(def.name));
    if (existing) {
      fieldMap[def.name] = existing.id;
      continue;
    }

    const created = await requestJiraJson(route`/rest/api/3/field`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: def.name,
        description: def.description,
        type: def.type,
        searcherKey: def.searcherKey,
      }),
    });

    fieldMap[def.name] = created.id;
  }

  await storage.set(FIELD_STORAGE_KEY, fieldMap);
  return fieldMap;
}

async function getConfig() {
  const existing = await storage.get(CONFIG_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const issueTypes = await requestJiraJson(route`/rest/api/3/issuetype`);
  const storyTypeIds = issueTypes
    .filter((type) => /story/i.test(type.name))
    .map((type) => type.id);

  const defaults = {
    storyTypeIds,
    linkTypeColorMap: {
      test: [],
      bug: [],
      requirement: [],
    },
  };

  await storage.set(CONFIG_STORAGE_KEY, defaults);
  return defaults;
}

async function getEpicIssueTypeNames() {
  const issueTypes = await requestJiraJson(route`/rest/api/3/issuetype`);
  const names = issueTypes
    .filter((type) => type.hierarchyLevel === 1 || /epic/i.test(type.name || ''))
    .map((type) => type.name)
    .filter(Boolean);
  return dedupe(names);
}

async function getEpicLinkFieldId() {
  const fields = await requestJiraJson(route`/rest/api/3/field`);
  const epicLinkField = fields.find(
    (field) =>
      field?.schema?.custom === 'com.pyxis.greenhopper.jira:gh-epic-link' ||
      normalizeName(field?.name) === 'epic link'
  );
  return epicLinkField?.id || null;
}

async function searchIssues(jql, fields) {
  let total = 0;
  const issues = [];
  let nextPageToken;
  let truncated = false;
  let lastPage;
  const fieldsParam = fields.length > 0 ? fields.join(',') : null;

  while (true) {
    const url = nextPageToken
      ? fieldsParam
        ? route`/rest/api/3/search/jql?jql=${jql}&maxResults=${PAGE_SIZE}&fields=${fieldsParam}&nextPageToken=${nextPageToken}`
        : route`/rest/api/3/search/jql?jql=${jql}&maxResults=${PAGE_SIZE}&nextPageToken=${nextPageToken}`
      : fieldsParam
        ? route`/rest/api/3/search/jql?jql=${jql}&maxResults=${PAGE_SIZE}&fields=${fieldsParam}`
        : route`/rest/api/3/search/jql?jql=${jql}&maxResults=${PAGE_SIZE}`;

    const data = await requestJiraJson(url, {
      headers: { Accept: 'application/json' },
    });

    lastPage = data;
    if (typeof data.total === 'number') {
      total = data.total;
    }
    if (data.issues && data.issues.length > 0) {
      issues.push(...data.issues);
    }

    if (issues.length >= MAX_ISSUES) {
      issues.length = MAX_ISSUES;
      truncated = true;
      break;
    }

    if (data.isLast === true) {
      break;
    }
    if (!data.nextPageToken || !data.issues || data.issues.length === 0) {
      break;
    }
    nextPageToken = data.nextPageToken;
  }

  return {
    issues,
    total: total || issues.length,
    truncated:
      truncated ||
      (typeof total === 'number' && total > 0 ? issues.length < total : false) ||
      (lastPage && lastPage.isLast === false),
  };
}

function filterIssuesByEpicKeys(issues, epicKeys, epicLinkFieldId) {
  if (!epicKeys || epicKeys.length === 0) {
    return issues;
  }

  const selectedEpicKeys = new Set(epicKeys.map((key) => String(key)));
  const issueByKey = new Map(issues.map((issue) => [issue.key, issue]));
  const epicByIssueKey = new Map();
  const resolving = new Set();

  const resolveEpicKey = (issueKey) => {
    if (epicByIssueKey.has(issueKey)) {
      return epicByIssueKey.get(issueKey);
    }
    if (resolving.has(issueKey)) {
      return null;
    }

    resolving.add(issueKey);
    const issue = issueByKey.get(issueKey);
    if (!issue) {
      resolving.delete(issueKey);
      epicByIssueKey.set(issueKey, null);
      return null;
    }

    if (isEpicIssue(issue)) {
      resolving.delete(issueKey);
      epicByIssueKey.set(issueKey, issue.key);
      return issue.key;
    }

    const directEpic = resolveDirectEpicKey(issue, epicLinkFieldId);
    if (directEpic) {
      resolving.delete(issueKey);
      epicByIssueKey.set(issueKey, directEpic);
      return directEpic;
    }

    const parentKey = issue.fields?.parent?.key;
    if (parentKey) {
      if (selectedEpicKeys.has(parentKey)) {
        resolving.delete(issueKey);
        epicByIssueKey.set(issueKey, parentKey);
        return parentKey;
      }
      const parentEpic = resolveEpicKey(parentKey);
      resolving.delete(issueKey);
      epicByIssueKey.set(issueKey, parentEpic);
      return parentEpic;
    }

    resolving.delete(issueKey);
    epicByIssueKey.set(issueKey, null);
    return null;
  };

  return issues.filter((issue) => {
    if (selectedEpicKeys.has(issue.key)) {
      return true;
    }
    const epicKey = resolveEpicKey(issue.key);
    return Boolean(epicKey && selectedEpicKeys.has(epicKey));
  });
}

function resolveDirectEpicKey(issue, epicLinkFieldId) {
  if (!issue || !issue.fields) {
    return null;
  }

  if (epicLinkFieldId) {
    const epicFieldValue = issue.fields[epicLinkFieldId];
    const epicKey = readEpicKeyFromEpicField(epicFieldValue);
    if (epicKey) {
      return epicKey;
    }
  }

  const parent = issue.fields.parent;
  if (parent && /epic/i.test(parent.fields?.issuetype?.name || '')) {
    return parent.key || null;
  }

  return null;
}

function readEpicKeyFromEpicField(value) {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (value.key) {
    return value.key;
  }
  return null;
}

function isEpicIssue(issue) {
  const issueTypeName = issue?.fields?.issuetype?.name || '';
  return /epic/i.test(issueTypeName);
}

function buildUseCaseMatrix(issues, fieldMap) {
  const useCaseField = fieldMap[FIELD_NAMES.USE_CASES];
  const uiViewField = fieldMap[FIELD_NAMES.AFFECTED_COMPONENTS];

  const rowSet = new Set();
  const columnSet = new Set();
  const cellMap = new Map();
  const issueIndex = {};

  for (const issue of issues) {
    const useCases = toArray(issue.fields[useCaseField]);
    const uiViews = toArray(issue.fields[uiViewField]);

    issueIndex[issue.key] = {
      key: issue.key,
      summary: issue.fields.summary,
      issueType: issue.fields.issuetype?.name,
      status: issue.fields.status?.name,
    };

    for (const useCase of useCases) {
      rowSet.add(useCase);
      for (const uiView of uiViews) {
        columnSet.add(uiView);
        const rowKey = useCase;
        const colKey = uiView;
        if (!cellMap.has(rowKey)) {
          cellMap.set(rowKey, new Map());
        }
        const row = cellMap.get(rowKey);
        if (!row.has(colKey)) {
          row.set(colKey, new Set());
        }
        row.get(colKey).add(issue.key);
      }
    }
  }

  const rows = Array.from(rowSet)
    .sort(sortStrings)
    .map((value) => ({ key: value, label: value }));
  const columns = Array.from(columnSet)
    .sort(sortStrings)
    .map((value) => ({ key: value, label: value }));

  const cells = Object.create(null);
  for (const [rowKey, rowMap] of cellMap.entries()) {
    const rowCells = Object.create(null);
    for (const [colKey, issueSet] of rowMap.entries()) {
      rowCells[colKey] = {
        issueKeys: Array.from(issueSet),
        count: issueSet.size,
        color: 'grey',
      };
    }
    cells[rowKey] = rowCells;
  }

  return {
    mode: 'use-case',
    rows,
    columns,
    cells,
    issueIndex,
  };
}

function buildComponentsMatrix(issues, fieldMap) {
  const componentField = fieldMap[FIELD_NAMES.AFFECTED_COMPONENTS];
  const rowSet = new Set();
  const columnSet = new Set();
  const cells = Object.create(null);
  const issueIndex = {};

  for (const issue of issues) {
    const rowKey = issue.key;
    const components = toArray(issue.fields?.[componentField]).map((value) => String(value).trim()).filter(Boolean);
    rowSet.add(rowKey);
    issueIndex[rowKey] = {
      key: issue.key,
      summary: issue.fields.summary,
      issueType: issue.fields.issuetype?.name,
      status: issue.fields.status?.name,
      priority: issue.fields.priority?.name || null,
    };

    if (components.length > 0) {
      cells[rowKey] = Object.create(null);
      for (const component of components) {
        columnSet.add(component);
        cells[rowKey][component] = {
          issueKeys: [issue.key],
          count: 1,
          color: 'green',
        };
      }
    }
  }

  const rows = Array.from(rowSet)
    .sort(sortStrings)
    .map((key) => ({
      key,
      label: issueIndex[key] ? `${key} - ${issueIndex[key].summary}` : key,
    }));

  const columns = Array.from(columnSet)
    .sort(sortStrings)
    .map((value) => ({ key: value, label: value }));

  return {
    mode: 'components',
    rows,
    columns,
    cells,
    issueIndex,
  };
}

async function buildStoryMatrix(issues, fieldMap, config) {
  const uiViewField = fieldMap[FIELD_NAMES.AFFECTED_COMPONENTS];
  const storyTypeIds = config.storyTypeIds || [];
  const storyIssues = getStoryIssues(issues, storyTypeIds);

  const rowSet = new Set();
  const columnSet = new Set();
  const cells = Object.create(null);
  const issueIndex = {};

  const linkedKeys = new Set();
  const linkMetaByStory = new Map();

  for (const issue of storyIssues) {
    issueIndex[issue.key] = {
      key: issue.key,
      summary: issue.fields.summary,
      issueType: issue.fields.issuetype?.name,
      status: issue.fields.status?.name,
    };

    const links = issue.fields.issuelinks || [];
    const linkInfo = [];

    for (const link of links) {
      const linkedIssue = link.inwardIssue || link.outwardIssue;
      if (!linkedIssue) {
        continue;
      }
      linkedKeys.add(linkedIssue.key);
      linkInfo.push({
        key: linkedIssue.key,
        typeName: link.type?.name || 'Link',
      });
    }

    linkMetaByStory.set(issue.key, linkInfo);
  }

  const linkedIssueIndex = await fetchLinkedIssueIndex(Array.from(linkedKeys));
  for (const [key, value] of Object.entries(linkedIssueIndex)) {
    issueIndex[key] = value;
  }

  for (const issue of storyIssues) {
    const uiViews = toArray(issue.fields[uiViewField]);
    const rowKey = issue.key;
    rowSet.add(rowKey);

    const linkInfo = linkMetaByStory.get(issue.key) || [];
    const color = resolveStoryColor(linkInfo, linkedIssueIndex, config.linkTypeColorMap || {});
    const linkedIssueKeys = linkInfo.map((item) => item.key);
    const cellIssueKeys = dedupe([issue.key, ...linkedIssueKeys]);

    if (!cells[rowKey]) {
      cells[rowKey] = Object.create(null);
    }

    for (const uiView of uiViews) {
      columnSet.add(uiView);
      cells[rowKey][uiView] = {
        issueKeys: cellIssueKeys,
        count: cellIssueKeys.length,
        color,
      };
    }
  }

  const rows = Array.from(rowSet)
    .sort(sortStrings)
    .map((key) => ({
      key,
      label: issueIndex[key] ? `${key} - ${issueIndex[key].summary}` : key,
    }));
  const columns = Array.from(columnSet)
    .sort(sortStrings)
    .map((value) => ({ key: value, label: value }));

  return {
    mode: 'story',
    rows,
    columns,
    cells,
    issueIndex,
  };
}

function buildStoryToStoryMatrix(issues, config) {
  const storyTypeIds = config.storyTypeIds || [];
  const storyIssues = getStoryIssues(issues, storyTypeIds);
  const storyKeySet = new Set(storyIssues.map((issue) => issue.key));

  const rowSet = new Set();
  const columnSet = new Set();
  const cells = Object.create(null);
  const issueIndex = {};

  for (const issue of storyIssues) {
    issueIndex[issue.key] = {
      key: issue.key,
      summary: issue.fields.summary,
      issueType: issue.fields.issuetype?.name,
      status: issue.fields.status?.name,
    };
    rowSet.add(issue.key);
    columnSet.add(issue.key);
  }

  for (const issue of storyIssues) {
    const rowKey = issue.key;
    const links = issue.fields.issuelinks || [];

    for (const link of links) {
      const linkedIssue = link.inwardIssue || link.outwardIssue;
      if (!linkedIssue || !storyKeySet.has(linkedIssue.key) || linkedIssue.key === rowKey) {
        continue;
      }

      const relation = classifyStoryToStoryRelation(link);
      if (!relation) {
        continue;
      }

      const colKey = linkedIssue.key;
      if (!cells[rowKey]) {
        cells[rowKey] = Object.create(null);
      }
      if (!cells[rowKey][colKey]) {
        cells[rowKey][colKey] = {
          issueKeys: [rowKey, colKey],
          count: 0,
          color: 'grey',
          fillStyle: 'full',
          colorHex: STORY_LINK_STYLE.relates.colorHex,
          relationType: 'relates',
          relations: [],
          directionByType: createStoryDirectionMap(),
        };
      }

      const cell = cells[rowKey][colKey];
      cell.relations.push({
        type: relation.type,
        direction: relation.directionLabel,
        typeName: relation.typeName,
      });

      if (relation.direction === 'row-to-column' || relation.direction === 'both') {
        cell.directionByType[relation.type].rowToColumn = true;
      }
      if (relation.direction === 'column-to-row' || relation.direction === 'both') {
        cell.directionByType[relation.type].columnToRow = true;
      }
    }
  }

  for (const rowCells of Object.values(cells)) {
    for (const [colKey, cell] of Object.entries(rowCells)) {
      const renderItems = resolveStoryToStoryRenderItems(cell.directionByType);
      if (renderItems.length === 0) {
        delete rowCells[colKey];
        continue;
      }

      const render = renderItems[0];
      cell.relationType = render.type;
      cell.fillStyle = render.fillStyle;
      cell.colorHex = render.colorHex;
      cell.renderItems = renderItems;
      cell.count = cell.relations.length;
      delete cell.directionByType;
    }
  }

  const rows = Array.from(rowSet)
    .sort(sortStrings)
    .map((key) => ({
      key,
      label: issueIndex[key] ? `${key} - ${issueIndex[key].summary}` : key,
    }));
  const columns = Array.from(columnSet)
    .sort(sortStrings)
    .map((key) => ({
      key,
      label: issueIndex[key] ? `${key} - ${issueIndex[key].summary}` : key,
    }));

  return {
    mode: 'story-to-story',
    rows,
    columns,
    cells,
    issueIndex,
  };
}

function buildHierarchicalView(issues) {
  const issueKeySet = new Set();
  const nodes = new Map();
  const issueByKey = new Map();
  const issueIndex = {};

  for (const issue of issues) {
    const key = issue.key;
    issueKeySet.add(key);
    issueByKey.set(key, issue);
    nodes.set(key, {
      key,
      parentKey: null,
      childKeys: new Set(),
      relatedKeys: new Set(),
    });
    issueIndex[key] = {
      key,
      summary: issue.fields.summary,
      issueType: issue.fields.issuetype?.name,
      status: issue.fields.status?.name,
      priority: issue.fields.priority?.name || null,
      fixedVersions: (issue.fields.fixVersions || [])
        .map((version) => version?.name)
        .filter(Boolean),
    };
  }

  for (const issue of issues) {
    const key = issue.key;
    const parentKey = issue.fields.parent?.key;
    if (!parentKey || !issueKeySet.has(parentKey)) {
      continue;
    }
    const node = nodes.get(key);
    const parentNode = nodes.get(parentKey);
    if (!node || !parentNode) {
      continue;
    }
    node.parentKey = parentKey;
    parentNode.childKeys.add(key);
  }

  const horizontalEdgeMap = new Map();
  const processedLinkIds = new Set();

  for (const issue of issues) {
    const sourceKey = issue.key;
    const sourceNode = nodes.get(sourceKey);
    if (!sourceNode) {
      continue;
    }

    for (const link of issue.fields.issuelinks || []) {
      const targetIssue = link.inwardIssue || link.outwardIssue;
      if (!targetIssue || !issueKeySet.has(targetIssue.key) || targetIssue.key === sourceKey) {
        continue;
      }

      const targetKey = targetIssue.key;
      const targetNode = nodes.get(targetKey);
      if (!targetNode) {
        continue;
      }

      const syntheticId = `${sourceKey}:${targetKey}:${link.type?.name || 'Link'}:${
        link.outwardIssue ? 'out' : 'in'
      }`;
      const linkId = link.id || syntheticId;
      if (processedLinkIds.has(linkId)) {
        continue;
      }
      processedLinkIds.add(linkId);

      // Parent-child relations are rendered as vertical hierarchy, not horizontal links.
      if (sourceNode.parentKey === targetKey || targetNode.parentKey === sourceKey) {
        continue;
      }

      const pair = [sourceKey, targetKey].sort(sortStrings);
      const pairKey = pair.join('|');
      if (!horizontalEdgeMap.has(pairKey)) {
        horizontalEdgeMap.set(pairKey, {
          from: pair[0],
          to: pair[1],
          types: new Set(),
        });
      }

      horizontalEdgeMap.get(pairKey).types.add(link.type?.name || 'Link');
      sourceNode.relatedKeys.add(targetKey);
      targetNode.relatedKeys.add(sourceKey);
    }
  }

  const allKeys = Array.from(issueKeySet).sort(sortStrings);
  const lonelyIssueKeys = allKeys.filter((key) => {
    const issue = issueByKey.get(key);
    if (issue && isEpicIssue(issue)) {
      return false;
    }
    const node = nodes.get(key);
    return node && !node.parentKey && node.childKeys.size === 0 && node.relatedKeys.size === 0;
  });
  const lonelySet = new Set(lonelyIssueKeys);
  const hierarchyKeys = allKeys.filter((key) => !lonelySet.has(key));
  const hierarchySet = new Set(hierarchyKeys);

  const levelsMap = new Map();
  const visited = new Set();
  const rootKeys = hierarchyKeys
    .filter((key) => {
      const parentKey = nodes.get(key)?.parentKey;
      return !parentKey || !hierarchySet.has(parentKey);
    })
    .sort(sortStrings);

  const queue = rootKeys.map((key) => ({ key, level: 0 }));
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current.key) || !hierarchySet.has(current.key)) {
      continue;
    }
    visited.add(current.key);
    if (!levelsMap.has(current.level)) {
      levelsMap.set(current.level, []);
    }
    levelsMap.get(current.level).push(current.key);

    const childKeys = Array.from(nodes.get(current.key)?.childKeys || [])
      .filter((childKey) => hierarchySet.has(childKey))
      .sort(sortStrings);
    for (const childKey of childKeys) {
      queue.push({ key: childKey, level: current.level + 1 });
    }
  }

  for (const unresolvedKey of hierarchyKeys) {
    if (visited.has(unresolvedKey)) {
      continue;
    }
    const fallbackQueue = [{ key: unresolvedKey, level: 0 }];
    while (fallbackQueue.length > 0) {
      const current = fallbackQueue.shift();
      if (!current || visited.has(current.key) || !hierarchySet.has(current.key)) {
        continue;
      }
      visited.add(current.key);
      if (!levelsMap.has(current.level)) {
        levelsMap.set(current.level, []);
      }
      levelsMap.get(current.level).push(current.key);

      const childKeys = Array.from(nodes.get(current.key)?.childKeys || [])
        .filter((childKey) => hierarchySet.has(childKey))
        .sort(sortStrings);
      for (const childKey of childKeys) {
        fallbackQueue.push({ key: childKey, level: current.level + 1 });
      }
    }
  }

  const levels = Array.from(levelsMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([level, issueKeys]) => ({
      level,
      issueKeys: issueKeys.sort(sortStrings),
    }));

  const verticalEdges = [];
  const nodeMeta = {};
  for (const key of hierarchyKeys) {
    const node = nodes.get(key);
    if (!node) {
      continue;
    }
    const childKeys = Array.from(node.childKeys)
      .filter((childKey) => hierarchySet.has(childKey))
      .sort(sortStrings);
    const relatedKeys = Array.from(node.relatedKeys)
      .filter((relatedKey) => hierarchySet.has(relatedKey))
      .sort(sortStrings);
    if (node.parentKey && hierarchySet.has(node.parentKey)) {
      verticalEdges.push({ from: node.parentKey, to: key });
    }
    nodeMeta[key] = {
      parentKey: node.parentKey && hierarchySet.has(node.parentKey) ? node.parentKey : null,
      childKeys,
      relatedKeys,
    };
  }

  const horizontalEdges = Array.from(horizontalEdgeMap.values())
    .map((edge) => ({
      from: edge.from,
      to: edge.to,
      types: Array.from(edge.types).sort(sortStrings),
    }))
    .filter((edge) => hierarchySet.has(edge.from) && hierarchySet.has(edge.to))
    .sort((a, b) => {
      const fromCompare = sortStrings(a.from, b.from);
      if (fromCompare !== 0) {
        return fromCompare;
      }
      return sortStrings(a.to, b.to);
    });

  return {
    mode: 'hierarchical',
    hierarchy: {
      levels,
      verticalEdges,
      horizontalEdges,
      nodeMeta,
    },
    lonelyIssueKeys,
    issueIndex,
  };
}

function getStoryIssues(issues, storyTypeIds) {

  return issues.filter((issue) => {
    if (!issue.fields.issuetype) {
      return false;
    }
    if (storyTypeIds.length === 0) {
      return /story/i.test(issue.fields.issuetype.name || '');
    }
    return storyTypeIds.includes(issue.fields.issuetype.id);
  });
}

function createStoryDirectionMap() {
  return {
    blocks: { rowToColumn: false, columnToRow: false },
    duplicates: { rowToColumn: false, columnToRow: false },
    clones: { rowToColumn: false, columnToRow: false },
    relates: { rowToColumn: false, columnToRow: false },
  };
}

function classifyStoryToStoryRelation(link) {
  const outwardPhrase = normalizeName(link.type?.outward);
  const inwardPhrase = normalizeName(link.type?.inward);
  const typeName = normalizeName(link.type?.name);

  const relationType = normalizeStandardStoryLinkType({ outwardPhrase, inwardPhrase, typeName });
  if (!relationType) {
    return null;
  }

  const isOutward = Boolean(link.outwardIssue);
  const directionLabel = isOutward ? link.type?.outward : link.type?.inward;

  if (relationType === 'relates') {
    return {
      type: relationType,
      direction: 'both',
      directionLabel: directionLabel || link.type?.name || 'relates to',
      typeName: link.type?.name || 'Relates',
    };
  }

  return {
    type: relationType,
    direction: isOutward ? 'row-to-column' : 'column-to-row',
    directionLabel: directionLabel || link.type?.name || 'related to',
    typeName: link.type?.name || relationType,
  };
}

function normalizeStandardStoryLinkType({ outwardPhrase, inwardPhrase, typeName }) {
  const isPair = (outwardValue, inwardValue) =>
    outwardPhrase === outwardValue && inwardPhrase === inwardValue;
  const hasNoPhrases = !outwardPhrase && !inwardPhrase;

  // Prefer exact outward/inward phrase pairs for standard Jira link types.
  if (isPair('blocks', 'is blocked by')) {
    return 'blocks';
  }
  if (isPair('duplicates', 'is duplicated by')) {
    return 'duplicates';
  }
  if (isPair('clones', 'is cloned by')) {
    return 'clones';
  }
  if (isPair('relates to', 'relates to')) {
    return 'relates';
  }

  // Fallback for payloads where phrases are missing but standard system names exist.
  if (hasNoPhrases) {
    if (typeName === 'blocks' || typeName === 'block') {
      return 'blocks';
    }
    if (typeName === 'duplicates' || typeName === 'duplicate') {
      return 'duplicates';
    }
    if (typeName === 'cloners' || typeName === 'clones' || typeName === 'clone') {
      return 'clones';
    }
    if (typeName === 'relates' || typeName === 'relates to' || typeName === 'relate') {
      return 'relates';
    }
  }

  return null;
}

function resolveStoryToStoryRender(directionByType) {
  const renderItems = resolveStoryToStoryRenderItems(directionByType);
  return renderItems.length > 0 ? renderItems[0] : null;
}

function resolveStoryToStoryRenderItems(directionByType) {
  const items = [];
  for (const type of STORY_LINK_PRIORITY) {
    const directions = directionByType[type];
    if (!directions || (!directions.rowToColumn && !directions.columnToRow)) {
      continue;
    }

    const style = STORY_LINK_STYLE[type];
    if (type === 'relates') {
      items.push({ type, fillStyle: 'full', colorHex: style.colorHex });
      continue;
    }
    if (directions.rowToColumn) {
      items.push({ type, fillStyle: 'full', colorHex: style.colorHex });
      continue;
    }
    items.push({ type, fillStyle: 'diagonal', colorHex: style.colorHex });
  }

  const nonRelates = items.filter((item) => item.type !== 'relates');
  if (nonRelates.length > 0) {
    return nonRelates;
  }
  return items;
}

async function fetchLinkedIssueIndex(issueKeys) {
  if (issueKeys.length === 0) {
    return {};
  }

  const index = {};
  const chunks = chunkArray(issueKeys, 50);

  for (const chunk of chunks) {
    const jql = `key in (${chunk.join(',')})`;
    const fieldsParam = ['summary', 'issuetype', 'status'].join(',');
    const url = route`/rest/api/3/search/jql?jql=${jql}&maxResults=${chunk.length}&fields=${fieldsParam}`;
    const data = await requestJiraJson(url, {
      headers: { Accept: 'application/json' },
    });

    for (const issue of data.issues || []) {
      index[issue.key] = {
        key: issue.key,
        summary: issue.fields.summary,
        issueType: issue.fields.issuetype?.name,
        status: issue.fields.status?.name,
      };
    }
  }

  return index;
}

function resolveStoryColor(linkInfo, linkedIssueIndex, linkTypeColorMap) {
  const linkTypeSets = {
    test: new Set((linkTypeColorMap.test || []).map(normalizeName)),
    bug: new Set((linkTypeColorMap.bug || []).map(normalizeName)),
    requirement: new Set((linkTypeColorMap.requirement || []).map(normalizeName)),
  };

  let hasTest = false;
  let hasBug = false;
  let hasRequirement = false;

  for (const link of linkInfo) {
    const linked = linkedIssueIndex[link.key];
    const issueType = normalizeName(linked?.issueType);

    if (issueType.includes('bug')) {
      hasBug = true;
    }
    if (issueType.includes('test')) {
      hasTest = true;
    }
    if (issueType.includes('requirement')) {
      hasRequirement = true;
    }

    const linkTypeName = normalizeName(link.typeName);
    if (linkTypeSets.test.has(linkTypeName)) {
      hasTest = true;
    }
    if (linkTypeSets.bug.has(linkTypeName)) {
      hasBug = true;
    }
    if (linkTypeSets.requirement.has(linkTypeName)) {
      hasRequirement = true;
    }
  }

  if (hasBug) {
    return 'orange';
  }
  if (hasRequirement) {
    return 'blue';
  }
  if (hasTest) {
    return 'green';
  }
  return 'grey';
}

async function groupIssueLinks(issuelinks) {
  const groups = new Map();
  const fallbackKeys = [];

  for (const link of issuelinks) {
    const linkedIssue = link.inwardIssue || link.outwardIssue;
    if (!linkedIssue) {
      continue;
    }

    const direction = link.inwardIssue ? link.type?.inward : link.type?.outward;
    const linkTypeName = link.type?.name || 'Link';

    const issueSummary = linkedIssue.fields?.summary;
    if (!issueSummary) {
      fallbackKeys.push(linkedIssue.key);
    }

    if (!groups.has(linkTypeName)) {
      groups.set(linkTypeName, []);
    }

    groups.get(linkTypeName).push({
      key: linkedIssue.key,
      summary: issueSummary,
      direction,
      issueType: linkedIssue.fields?.issuetype?.name,
    });
  }

  if (fallbackKeys.length > 0) {
    const fallbackIndex = await fetchLinkedIssueIndex(dedupe(fallbackKeys));
    for (const issues of groups.values()) {
      for (const issue of issues) {
        if (!issue.summary && fallbackIndex[issue.key]) {
          issue.summary = fallbackIndex[issue.key].summary;
          issue.issueType = fallbackIndex[issue.key].issueType;
        }
      }
    }
  }

  return Array.from(groups.entries()).map(([typeName, issues]) => ({
    typeName,
    issues,
  }));
}

function buildJql({ projectKey, issueTypes, fixedVersions, labels, components, componentFieldId, jql, sprint }) {
  const parts = [];

  if (projectKey) {
    parts.push(`project = ${quoteJql(projectKey)}`);
  }
  if (issueTypes && issueTypes.length > 0) {
    const types = issueTypes.map(quoteJql).join(', ');
    parts.push(`issuetype in (${types})`);
  }
  if (fixedVersions && fixedVersions.length > 0) {
    const versions = fixedVersions.map(quoteJql).join(', ');
    parts.push(`fixVersion in (${versions})`);
  }
  if (labels && labels.length > 0) {
    const labelValues = labels.map(quoteJql).join(', ');
    parts.push(`labels in (${labelValues})`);
  }
  if (components && components.length > 0 && componentFieldId) {
    const componentValues = components.map(quoteJql).join(', ');
    parts.push(`${componentFieldId} in (${componentValues})`);
  }
  if (sprint) {
    const sprintValue = String(sprint).trim();
    if (/^\d+$/.test(sprintValue)) {
      parts.push(`sprint = ${sprintValue}`);
    } else {
      parts.push(`sprint = ${quoteJql(sprintValue)}`);
    }
  }
  if (jql && String(jql).trim()) {
    parts.push(`(${jql})`);
  }

  return parts.join(' AND ');
}

function filterIssuesByComponents(issues, components, componentFieldId) {
  if (!components || components.length === 0 || !componentFieldId) {
    return issues;
  }

  const selected = new Set(components.map(normalizeName));
  return issues.filter((issue) => {
    const issueComponents = toArray(issue.fields?.[componentFieldId]).map((value) => normalizeName(value));
    return issueComponents.some((component) => selected.has(component));
  });
}

function quoteJql(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function toArray(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return [value];
}

function normalizeName(value) {
  return String(value || '').trim().toLowerCase();
}

function sortStrings(a, b) {
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function chunkArray(values, size) {
  const chunks = [];
  for (let i = 0; i < values.length; i += size) {
    chunks.push(values.slice(i, i + size));
  }
  return chunks;
}

function dedupe(values) {
  return Array.from(new Set(values));
}

function canFallbackToEpicLink(error) {
  const message = String(error?.message || '').toLowerCase();
  if (!message) {
    return false;
  }
  return message.includes('parent') &&
    (message.includes('cannot be set') ||
      message.includes('is not on the appropriate screen') ||
      message.includes('field') ||
      message.includes('unknown'));
}

function clearMatrixCache() {
  matrixCache.clear();
}

function getCache(key) {
  const entry = matrixCache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    matrixCache.delete(key);
    return null;
  }
  return entry.value;
}

function setCache(key, value) {
  matrixCache.set(key, { timestamp: Date.now(), value });
  if (matrixCache.size <= MATRIX_CACHE_MAX) {
    return;
  }
  const firstKey = matrixCache.keys().next().value;
  matrixCache.delete(firstKey);
}
