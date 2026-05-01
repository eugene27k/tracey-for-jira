import React, { useEffect, useMemo, useState } from 'react';
import ForgeReconciler, {
  Badge,
  Box,
  Button,
  Checkbox,
  DynamicTable,
  Heading,
  Image,
  Inline,
  Link,
  ModalDialog,
  Range,
  SectionMessage,
  Select,
  Spinner,
  Stack,
  Tag,
  Text,
  Textfield,
  Tooltip,
  useProductContext,
  xcss,
} from '@forge/react';
import { invoke, router, NavigationTarget } from '@forge/bridge';

const cellBaseStyle = xcss({
  width: '22px',
  height: '22px',
  borderRadius: 'radius.small',
  borderColor: 'color.border',
  borderWidth: 'border.width',
  borderStyle: 'solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

const storyCellBaseStyle = xcss({
  width: '22px',
  height: '22px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

const scrollContainerStyle = xcss({
  overflowX: 'auto',
  overflowY: 'auto',
  maxHeight: '70vh',
  borderColor: 'color.border',
  borderWidth: 'border.width',
  borderStyle: 'solid',
  borderRadius: 'radius.medium',
});

const hierarchyViewportStyle = xcss({
  overflowX: 'auto',
  overflowY: 'auto',
  maxHeight: '70vh',
  borderColor: 'color.border',
  borderWidth: 'border.width',
  borderStyle: 'solid',
  borderRadius: 'radius.medium',
});

const legendItemStyle = xcss({
  width: '14px',
  height: '14px',
  borderRadius: 'radius.small',
  borderColor: 'color.border',
  borderWidth: 'border.width',
  borderStyle: 'solid',
});

const panelCardStyle = xcss({
  backgroundColor: 'elevation.surface',
  borderColor: 'color.border',
  borderWidth: 'border.width',
  borderStyle: 'solid',
  borderRadius: 'radius.medium',
  padding: 'space.200',
});

const filterPanelStyle = xcss({
  backgroundColor: 'elevation.surface',
  borderColor: 'color.border',
  borderWidth: 'border.width',
  borderStyle: 'solid',
  borderRadius: 'radius.medium',
  padding: 'space.100',
});

const filterHeaderStyle = xcss({
  display: 'flex',
  alignItems: 'center',
  gap: 'space.100',
  flexWrap: 'nowrap',
});

const filterHeaderTitleStyle = xcss({
  flexGrow: 1,
  textAlign: 'center',
});

const filterHeaderLeftStyle = xcss({
  display: 'flex',
  alignItems: 'center',
  minWidth: '70px',
  justifyContent: 'flex-start',
  flexShrink: 0,
});

const filterHeaderActionsStyle = xcss({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  minWidth: '160px',
  flexShrink: 0,
});

const filterSummaryTextStyle = xcss({
  maxWidth: '160px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const issueAxisLabelStyle = xcss({
  minWidth: '120px',
});

const componentHeaderCellStyle = xcss({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const componentDataCellStyle = xcss({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const standaloneIssueCardStyle = xcss({
  minWidth: '220px',
  maxWidth: '260px',
  backgroundColor: 'elevation.surface',
  borderColor: 'color.border',
  borderWidth: 'border.width',
  borderStyle: 'solid',
  borderRadius: 'radius.medium',
  padding: 'space.150',
});

const emptyCellColor = 'color.background.neutral.subtlest';
const STORY_CELL_SIZE = 22;
const LEGEND_SWATCH_SIZE = 14;
const STORY_TO_STORY_ROWS_PER_PAGE = 20;
const HIERARCHY_EDGE_PREVIEW_LIMIT = 40;
const HIERARCHY_ZOOM_MIN = 40;
const HIERARCHY_ZOOM_MAX = 2000;
const HIERARCHY_ZOOM_STEP = 20;
const HIERARCHY_PAN_MIN = 0;
const HIERARCHY_PAN_MAX = 100;

const colorTokens = {
  grey: 'color.background.neutral',
  green: 'color.background.success.bold',
  orange: 'color.background.warning',
  blue: 'color.background.discovery',
};

const legendByMode = {
  components: [
    { label: 'Issue linked to component', color: 'green' },
  ],
  'use-case': [
    { label: 'Relationship exists', color: 'grey' },
  ],
  story: [
    { label: 'Story touches view', color: 'grey' },
    { label: 'Has linked Test', color: 'green' },
    { label: 'Has linked Bug', color: 'orange' },
    { label: 'Has linked Requirement', color: 'blue' },
  ],
  'story-to-story': [
    { label: 'Blocks (row -> column)', colorHex: '#D32F2F', fillStyle: 'full' },
    { label: 'Is blocked by (column -> row)', colorHex: '#D32F2F', fillStyle: 'diagonal' },
    { label: 'Duplicates / Is duplicated by', colorHex: '#7B1FA2', fillStyle: 'full' },
    { label: 'Clones / Is cloned by', colorHex: '#FBC02D', fillStyle: 'full' },
    { label: 'Relates to', colorHex: '#9E9E9E', fillStyle: 'full' },
  ],
};

const storyFillImageCache = new Map();
const rotatedComponentLabelCache = new Map();
const hierarchyImageCache = new Map();

function buildStoryFillDataUri(fillStyle, colorHex, size) {
  const safeFillStyle = fillStyle === 'diagonal' ? 'diagonal' : 'full';
  const key = `${safeFillStyle}:${colorHex}:${size}`;
  const cached = storyFillImageCache.get(key);
  if (cached) {
    return cached;
  }

  const square = Number(size) || STORY_CELL_SIZE;
  const polygon =
    safeFillStyle === 'diagonal'
      ? `<polygon points="0,${square} ${square},${square} ${square},0" fill="${colorHex}" />`
      : `<rect width="${square}" height="${square}" fill="${colorHex}" />`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${square}" height="${square}" viewBox="0 0 ${square} ${square}">${polygon}</svg>`;
  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  storyFillImageCache.set(key, dataUri);
  return dataUri;
}

function escapeSvgText(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildRotatedComponentLabelDataUri(label) {
  const normalized = String(label || '').trim() || 'Component';
  const cached = rotatedComponentLabelCache.get(normalized);
  if (cached) {
    return cached;
  }

  const displayLabel = truncateText(normalized, 30);
  const width = 24;
  const height = clampNumber(Math.max(72, displayLabel.length * 5), 72, 102);
  const safeLabel = escapeSvgText(displayLabel);
  const centerX = width / 2;
  const baselineY = height - 4;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <text x="${centerX}" y="${baselineY}" transform="rotate(-90 ${centerX} ${baselineY})" fill="#B6C2CF" font-family="Arial, sans-serif" font-size="10">${safeLabel}</text>
    </svg>
  `;
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  const payload = { src, width, height };
  rotatedComponentLabelCache.set(normalized, payload);
  return payload;
}

function escapeJqlValue(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function truncateText(value, maxLength) {
  const normalized = String(value || '');
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, Math.max(0, maxLength - 3))}...`;
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildHierarchySvgDataUri(hierarchy, issueIndex, viewport = {}) {
  const levels = hierarchy?.levels || [];
  if (levels.length === 0) {
    return null;
  }

  const zoom = clampNumber(viewport.zoom || 100, HIERARCHY_ZOOM_MIN, HIERARCHY_ZOOM_MAX);
  const panX = clampNumber(viewport.panX || 0, HIERARCHY_PAN_MIN, HIERARCHY_PAN_MAX);
  const panY = clampNumber(viewport.panY || 0, HIERARCHY_PAN_MIN, HIERARCHY_PAN_MAX);

  const cacheKey = JSON.stringify({
    levels,
    edges: hierarchy,
    issueIndex,
    zoom,
    panX,
    panY,
  });
  const cached = hierarchyImageCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const cardWidth = 270;
  const cardHeight = 118;
  const horizontalGap = 36;
  const verticalGap = 84;
  const margin = 36;
  const rootGap = 84;

  const nodeMeta = hierarchy?.nodeMeta || {};
  const fallbackKeys = levels.flatMap((level) => level.issueKeys || []);
  const allNodeKeys = (Object.keys(nodeMeta).length > 0 ? Object.keys(nodeMeta) : fallbackKeys)
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }));
  const nodeKeySet = new Set(allNodeKeys);
  if (allNodeKeys.length === 0) {
    return null;
  }

  const childMap = {};
  const parentMap = {};
  for (const key of allNodeKeys) {
    const children = Array.isArray(nodeMeta[key]?.childKeys) ? nodeMeta[key].childKeys : [];
    childMap[key] = children
      .filter((childKey) => nodeKeySet.has(childKey))
      .sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }));
    const parentKey = nodeMeta[key]?.parentKey;
    parentMap[key] = parentKey && nodeKeySet.has(parentKey) ? parentKey : null;
  }

  const rootKeys = allNodeKeys
    .filter((key) => !parentMap[key])
    .sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }));
  const effectiveRoots = rootKeys.length > 0 ? rootKeys : allNodeKeys;

  const measureCache = new Map();
  const measureStack = new Set();
  const measureSubtreeWidth = (key) => {
    if (measureCache.has(key)) {
      return measureCache.get(key);
    }
    if (measureStack.has(key)) {
      return cardWidth;
    }
    measureStack.add(key);

    const children = childMap[key] || [];
    let width = cardWidth;
    if (children.length > 0) {
      let childrenWidth = 0;
      for (let index = 0; index < children.length; index += 1) {
        if (index > 0) {
          childrenWidth += horizontalGap;
        }
        childrenWidth += measureSubtreeWidth(children[index]);
      }
      width = Math.max(cardWidth, childrenWidth);
    }

    measureStack.delete(key);
    measureCache.set(key, width);
    return width;
  };

  const positions = {};
  const depths = {};
  const assigned = new Set();
  const assignSubtree = (key, startX, depth, branchStack = new Set()) => {
    if (assigned.has(key)) {
      return;
    }
    if (branchStack.has(key)) {
      positions[key] = { x: startX, y: margin + depth * (cardHeight + verticalGap) };
      depths[key] = depth;
      assigned.add(key);
      return;
    }

    const nextStack = new Set(branchStack);
    nextStack.add(key);

    const subtreeWidth = measureSubtreeWidth(key);
    const y = margin + depth * (cardHeight + verticalGap);
    const children = (childMap[key] || []).filter((childKey) => !assigned.has(childKey));

    if (children.length === 0) {
      positions[key] = {
        x: startX + (subtreeWidth - cardWidth) / 2,
        y,
      };
      depths[key] = depth;
      assigned.add(key);
      return;
    }

    let childCursor = startX;
    const childCenters = [];
    for (const childKey of children) {
      const childWidth = measureSubtreeWidth(childKey);
      assignSubtree(childKey, childCursor, depth + 1, nextStack);
      if (positions[childKey]) {
        childCenters.push(positions[childKey].x + cardWidth / 2);
      }
      childCursor += childWidth + horizontalGap;
    }

    let nodeX = startX + (subtreeWidth - cardWidth) / 2;
    if (childCenters.length > 0) {
      const minCenter = Math.min(...childCenters);
      const maxCenter = Math.max(...childCenters);
      nodeX = (minCenter + maxCenter) / 2 - cardWidth / 2;
    }
    const minX = startX;
    const maxX = startX + subtreeWidth - cardWidth;
    nodeX = Math.max(minX, Math.min(maxX, nodeX));

    positions[key] = { x: nodeX, y };
    depths[key] = depth;
    assigned.add(key);
  };

  let cursorX = margin;
  for (const rootKey of effectiveRoots) {
    if (assigned.has(rootKey)) {
      continue;
    }
    const subtreeWidth = measureSubtreeWidth(rootKey);
    assignSubtree(rootKey, cursorX, 0);
    cursorX += subtreeWidth + rootGap;
  }

  for (const key of allNodeKeys) {
    if (assigned.has(key)) {
      continue;
    }
    const subtreeWidth = measureSubtreeWidth(key);
    assignSubtree(key, cursorX, 0);
    cursorX += subtreeWidth + rootGap;
  }

  let maxX = 0;
  let maxY = 0;
  for (const position of Object.values(positions)) {
    maxX = Math.max(maxX, position.x + cardWidth);
    maxY = Math.max(maxY, position.y + cardHeight);
  }

  const canvasWidth = Math.max(maxX + margin, cardWidth + margin * 2);
  const canvasHeight = Math.max(maxY + margin, cardHeight + margin * 2);
  const maxDepth = Math.max(...Object.values(depths), 0);

  const parts = [];

  for (const edge of hierarchy?.verticalEdges || []) {
    const from = positions[edge.from];
    const to = positions[edge.to];
    if (!from || !to) {
      continue;
    }
    const fromX = from.x + cardWidth / 2;
    const fromY = from.y + cardHeight;
    const toX = to.x + cardWidth / 2;
    const toY = to.y;
    const midY = fromY + (toY - fromY) / 2;
    parts.push(
      `<path d="M ${fromX} ${fromY} L ${fromX} ${midY} L ${toX} ${midY} L ${toX} ${toY}" stroke="#8C9BAB" stroke-width="2" fill="none" />`
    );
  }

  for (const edge of hierarchy?.horizontalEdges || []) {
    const from = positions[edge.from];
    const to = positions[edge.to];
    if (!from || !to) {
      continue;
    }
    const fromX = from.x + cardWidth / 2;
    const fromY = from.y + cardHeight / 2;
    const toX = to.x + cardWidth / 2;
    const toY = to.y + cardHeight / 2;
    const liftY = Math.min(fromY, toY) - 42;
    const controlDelta = Math.max(50, Math.abs(toX - fromX) / 2);
    const fromControlX = fromX < toX ? fromX + controlDelta : fromX - controlDelta;
    const toControlX = fromX < toX ? toX - controlDelta : toX + controlDelta;

    parts.push(
      `<path d="M ${fromX} ${fromY} C ${fromControlX} ${liftY} ${toControlX} ${liftY} ${toX} ${toY}" stroke="#4C9AFF" stroke-width="1.5" stroke-dasharray="6 5" fill="none" opacity="0.82" />`
    );
  }

  for (const [key, position] of Object.entries(positions)) {
    const issue = issueIndex[key] || {};
    const summary = escapeSvgText(truncateText(issue.summary || '', 58));
    const status = escapeSvgText(truncateText(issue.status || 'No status', 28));
    const priority = escapeSvgText(truncateText(issue.priority || 'No priority', 28));
    const issueType = escapeSvgText(truncateText(issue.issueType || 'Issue', 24));
    const meta = hierarchy?.nodeMeta?.[key] || {};
    const childCount = Array.isArray(meta.childKeys) ? meta.childKeys.length : 0;
    const relatedCount = Array.isArray(meta.relatedKeys) ? meta.relatedKeys.length : 0;
    const keyText = escapeSvgText(key);

    parts.push(
      `<rect x="${position.x}" y="${position.y}" width="${cardWidth}" height="${cardHeight}" rx="10" fill="#1F2329" stroke="#57606A" stroke-width="1.5" />`
    );
    parts.push(
      `<rect x="${position.x + 12}" y="${position.y + 10}" width="104" height="24" rx="6" fill="#2A2F36" stroke="#6B7785" stroke-width="1" />`
    );
    parts.push(
      `<text x="${position.x + 20}" y="${position.y + 27}" fill="#DFE1E6" font-size="12" font-weight="700" font-family="Arial, sans-serif">${keyText}</text>`
    );
    parts.push(
      `<text x="${position.x + 12}" y="${position.y + 54}" fill="#B6C2CF" font-size="12" font-family="Arial, sans-serif">${summary}</text>`
    );
    parts.push(
      `<text x="${position.x + 12}" y="${position.y + 75}" fill="#9FADBC" font-size="11" font-family="Arial, sans-serif">Status: ${status}</text>`
    );
    parts.push(
      `<text x="${position.x + 12}" y="${position.y + 91}" fill="#9FADBC" font-size="11" font-family="Arial, sans-serif">Priority: ${priority}</text>`
    );
    parts.push(
      `<text x="${position.x + 12}" y="${position.y + 107}" fill="#9FADBC" font-size="11" font-family="Arial, sans-serif">${issueType} | children: ${childCount} | links: ${relatedCount}</text>`
    );
  }

  for (let levelIndex = 0; levelIndex <= maxDepth; levelIndex += 1) {
    const y = margin + levelIndex * (cardHeight + verticalGap) + 16;
    parts.push(
      `<text x="8" y="${y}" fill="#7A869A" font-size="11" font-family="Arial, sans-serif">L${levelIndex + 1}</text>`
    );
  }

  const viewWidth = canvasWidth * (100 / zoom);
  const viewHeight = canvasHeight * (100 / zoom);
  const maxViewX = Math.max(0, canvasWidth - viewWidth);
  const maxViewY = Math.max(0, canvasHeight - viewHeight);
  const viewX = maxViewX * (panX / 100);
  const viewY = maxViewY * (panY / 100);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="${viewX} ${viewY} ${viewWidth} ${viewHeight}">${parts.join('')}</svg>`;
  const payload = {
    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    width: canvasWidth,
    height: canvasHeight,
    viewWidth,
    viewHeight,
  };
  hierarchyImageCache.set(cacheKey, payload);
  return payload;
}

function buildCellTooltipText(mode, row, column, cell, issueIndex) {
  if (!cell) {
    return '';
  }

  if (mode === 'components') {
    const rowIssue = issueIndex[row.key] || { key: row.key, summary: '' };
    const summary = rowIssue.summary ? ` | ${rowIssue.summary}` : '';
    return `${rowIssue.key}${summary} <-> ${column.label}`;
  }

  if (mode !== 'story-to-story') {
    return `${cell.count} issue(s)`;
  }

  const rowIssue = issueIndex[row.key] || { key: row.key };
  const columnIssue = issueIndex[column.key] || { key: column.key };
  const rowStatus = rowIssue.status || 'Unknown status';
  const columnStatus = columnIssue.status || 'Unknown status';

  const header = `${rowIssue.key} (${rowStatus}) <-> ${columnIssue.key} (${columnStatus})`;
  const relations = Array.isArray(cell.relations) ? cell.relations : [];
  if (relations.length === 0) {
    return header;
  }

  const relationsText = relations
    .map((relation, index) => {
      const direction = relation.direction || 'related to';
      const typeName = relation.typeName ? ` [${relation.typeName}]` : '';
      return `${index + 1}. ${direction}${typeName}`;
    })
    .join(' | ');

  return `${header} | ${relationsText}`;
}

function renderStoryAxisLabel(mode, axisItem, issueIndex, siteUrl) {
  if (mode !== 'story-to-story' && mode !== 'components') {
    return <Text size="small">{axisItem.label}</Text>;
  }

  const issue = issueIndex[axisItem.key];
  if (!issue) {
    return <Text size="small">{axisItem.label}</Text>;
  }

  const summary = issue.summary || '';
  const shortSummary = truncateText(summary, 40);
  const combinedLabel = `${issue.key} | ${shortSummary || axisItem.label}`;
  const compactLabelNode = <Text size="small">{combinedLabel}</Text>;
  if (!siteUrl) {
    return compactLabelNode;
  }
  return (
    <Link href={`${siteUrl}/browse/${issue.key}`} openNewTab>
      {compactLabelNode}
    </Link>
  );
}

function renderComponentColumnLabel(column, siteUrl, projectKey) {
  const label = column.label || column.key;
  const shortLabel = truncateText(label, 30);
  const jql = `project = "${escapeJqlValue(projectKey)}" AND "Affected Components" in ("${escapeJqlValue(label)}")`;
  const href = siteUrl && projectKey ? `${siteUrl}/issues/?jql=${encodeURIComponent(jql)}` : null;
  const labelNode = <Text size="small">{shortLabel}</Text>;
  return (
    <Tooltip content={label}>
      {href ? (
        <Link href={href} openNewTab>
          {labelNode}
        </Link>
      ) : (
        labelNode
      )}
    </Tooltip>
  );
}

function App() {
  const context = useProductContext();

  if (!context) {
    return (
      <Box padding="space.200">
        <Spinner />
      </Box>
    );
  }

  const moduleKey = context.moduleKey || context.extension?.moduleKey;

  if (moduleKey === 'traceability-issue-panel') {
    return <IssuePanel context={context} />;
  }

  if (moduleKey === 'traceability-admin-page') {
    return <AdminPage />;
  }

  return <ProjectMatrix context={context} />;
}

function ProjectMatrix({ context }) {
  const projectKey = context.extension?.project?.key || context.project?.key;
  const siteUrl = context.siteUrl;

  const [mode, setMode] = useState('components');
  const [issueTypes, setIssueTypes] = useState([]);
  const [epics, setEpics] = useState([]);
  const [fixedVersions, setFixedVersions] = useState([]);
  const [labels, setLabels] = useState([]);
  const [components, setComponents] = useState([]);
  const [selectedIssueTypes, setSelectedIssueTypes] = useState([]);
  const [selectedEpicKeys, setSelectedEpicKeys] = useState([]);
  const [selectedFixedVersions, setSelectedFixedVersions] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [jql, setJql] = useState('');
  const [relatedOnly, setRelatedOnly] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [storyToStoryPage, setStoryToStoryPage] = useState(1);
  const [hierarchyZoom, setHierarchyZoom] = useState(100);
  const [hierarchyPanX, setHierarchyPanX] = useState(0);
  const [hierarchyPanY, setHierarchyPanY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const isStoryToStoryMode = mode === 'story-to-story';
  const isComponentsMode = mode === 'components';
  const isHierarchicalMode = mode === 'hierarchical';
  const openInteractiveHierarchyView = () => {
    if (!projectKey) {
      return;
    }
    router.open({
      target: NavigationTarget.Module,
      moduleKey: 'traceability-hierarchical-project-settings-page',
      projectKey,
    });
  };

  const openEnhancedMatrixView = async () => {
    if (!projectKey) {
      return;
    }

    await invoke('setEnhancedMatrixState', {
      projectKey,
      state: {
        mode,
        issueTypes: selectedIssueTypes,
        epicKeys: selectedEpicKeys,
        fixedVersions: selectedFixedVersions,
        labels: selectedLabels,
        components: selectedComponents,
        jql,
        relatedOnly,
      },
    });

    router.open({
      target: NavigationTarget.Module,
      moduleKey: 'traceability-enhanced-matrix-global-page',
    });
  };

  useEffect(() => {
    if (!projectKey) {
      return;
    }

    let mounted = true;
    Promise.all([
      invoke('getIssueTypes'),
      invoke('getEpics', { projectKey }),
      invoke('getFixedVersions', { projectKey }),
      invoke('getProjectLabels', { projectKey }),
      invoke('getProjectComponents', { projectKey }),
    ])
      .then(([types, epicList, fixedVersionList, labelList, componentList]) => {
        if (!mounted) {
          return;
        }
        setIssueTypes(types);
        setEpics(epicList || []);
        setFixedVersions(fixedVersionList || []);
        setLabels(labelList || []);
        setComponents(componentList || []);
      })
      .catch((err) => {
        if (!mounted) {
          return;
        }
        setError(err.message || 'Failed to load issue filters.');
      });

    return () => {
      mounted = false;
    };
  }, [projectKey]);

  const issueTypeOptions = useMemo(
    () => issueTypes.map((type) => ({ label: type.name, value: type.name })),
    [issueTypes]
  );

  const epicOptions = useMemo(
    () =>
      epics.map((epic) => ({
        label: epic.summary ? `${epic.key} - ${epic.summary}` : epic.key,
        value: epic.key,
      })),
    [epics]
  );

  const fixedVersionOptions = useMemo(
    () =>
      fixedVersions.map((version) => ({
        label: version.name,
        value: version.name,
      })),
    [fixedVersions]
  );

  const labelOptions = useMemo(
    () =>
      labels.map((label) => ({
        label,
        value: label,
      })),
    [labels]
  );

  const componentOptions = useMemo(
    () =>
      components.map((component) => ({
        label: component,
        value: component,
      })),
    [components]
  );

  const selectedIssueTypeOptions = useMemo(
    () => issueTypeOptions.filter((option) => selectedIssueTypes.includes(option.value)),
    [issueTypeOptions, selectedIssueTypes]
  );

  const selectedEpicOptions = useMemo(
    () => epicOptions.filter((option) => selectedEpicKeys.includes(option.value)),
    [epicOptions, selectedEpicKeys]
  );

  const selectedFixedVersionOptions = useMemo(
    () => fixedVersionOptions.filter((option) => selectedFixedVersions.includes(option.value)),
    [fixedVersionOptions, selectedFixedVersions]
  );

  const selectedLabelOptions = useMemo(
    () => labelOptions.filter((option) => selectedLabels.includes(option.value)),
    [labelOptions, selectedLabels]
  );

  const selectedComponentOptions = useMemo(
    () => componentOptions.filter((option) => selectedComponents.includes(option.value)),
    [componentOptions, selectedComponents]
  );

  const filterSummaryText = useMemo(() => {
    const parts = [];
    if (selectedIssueTypes.length > 0) {
      parts.push(`${selectedIssueTypes.length} issue types`);
    }
    if (selectedEpicKeys.length > 0) {
      parts.push(`${selectedEpicKeys.length} epics`);
    }
    if (selectedFixedVersions.length > 0) {
      parts.push(`${selectedFixedVersions.length} versions`);
    }
    if (selectedLabels.length > 0) {
      parts.push(`${selectedLabels.length} labels`);
    }
    if (selectedComponents.length > 0) {
      parts.push(`${selectedComponents.length} components`);
    }
    if (String(jql || '').trim()) {
      parts.push('JQL');
    }
    if (isStoryToStoryMode && relatedOnly) {
      parts.push('Related only');
    }
    return parts.length > 0 ? parts.join(' • ') : 'No filters';
  }, [
    selectedIssueTypes,
    selectedEpicKeys,
    selectedFixedVersions,
    selectedLabels,
    selectedComponents,
    jql,
    isStoryToStoryMode,
    relatedOnly,
  ]);

  const loadMatrix = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke('getMatrixData', {
        projectKey,
        mode,
        issueTypes: selectedIssueTypes,
        epicKeys: selectedEpicKeys,
        fixedVersions: selectedFixedVersions,
        labels: selectedLabels,
        components: selectedComponents,
        jql,
      });
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load matrix data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectKey) {
      loadMatrix();
    }
  }, [mode, projectKey]);

  useEffect(() => {
    if (isStoryToStoryMode) {
      setStoryToStoryPage(1);
    }
  }, [
    isStoryToStoryMode,
    selectedIssueTypes,
    selectedEpicKeys,
    selectedFixedVersions,
    selectedLabels,
    selectedComponents,
    jql,
    relatedOnly,
  ]);

  useEffect(() => {
    setSelectedCell(null);
  }, [mode]);


  useEffect(() => {
    if (!isHierarchicalMode) {
      return;
    }
    setHierarchyZoom(100);
    setHierarchyPanX(0);
    setHierarchyPanY(0);
  }, [isHierarchicalMode, data?.jql]);

  useEffect(() => {
    if (hierarchyZoom <= 100) {
      setHierarchyPanX(0);
      setHierarchyPanY(0);
    }
  }, [hierarchyZoom]);
  const legendItems = legendByMode[mode] || [];

  const rows = data?.rows || [];
  const columns = data?.columns || [];
  const cells = data?.cells || {};
  const issueIndex = data?.issueIndex || {};
  const hierarchy = data?.hierarchy || null;
  const lonelyIssueKeys = data?.lonelyIssueKeys || [];
  const hierarchyGraphic = useMemo(
    () =>
      buildHierarchySvgDataUri(hierarchy, issueIndex, {
        zoom: hierarchyZoom,
        panX: hierarchyPanX,
        panY: hierarchyPanY,
      }),
    [hierarchy, issueIndex, hierarchyZoom, hierarchyPanX, hierarchyPanY]
  );
  const horizontalEdges = hierarchy?.horizontalEdges || [];
  const horizontalEdgePreview = horizontalEdges.slice(0, HIERARCHY_EDGE_PREVIEW_LIMIT);

  const zoomInHierarchy = () =>
    setHierarchyZoom((prev) => clampNumber(prev + HIERARCHY_ZOOM_STEP, HIERARCHY_ZOOM_MIN, HIERARCHY_ZOOM_MAX));
  const zoomOutHierarchy = () =>
    setHierarchyZoom((prev) => clampNumber(prev - HIERARCHY_ZOOM_STEP, HIERARCHY_ZOOM_MIN, HIERARCHY_ZOOM_MAX));
  const resetHierarchyZoom = () => {
    setHierarchyZoom(100);
    setHierarchyPanX(0);
    setHierarchyPanY(0);
  };

  const matrixView = useMemo(() => {
    if (!isStoryToStoryMode || !relatedOnly) {
      return { rows, columns };
    }

    const relatedKeys = new Set();
    for (const [rowKey, rowCells] of Object.entries(cells)) {
      const colKeys = Object.keys(rowCells || {});
      if (colKeys.length > 0) {
        relatedKeys.add(rowKey);
      }
      for (const colKey of colKeys) {
        relatedKeys.add(colKey);
      }
    }

    return {
      rows: rows.filter((row) => relatedKeys.has(row.key)),
      columns: columns.filter((column) => relatedKeys.has(column.key)),
    };
  }, [isStoryToStoryMode, relatedOnly, rows, columns, cells]);

  const displayRows = matrixView.rows;
  const displayColumns = matrixView.columns;

  const head = useMemo(() => {
    if (displayColumns.length === 0) {
      return null;
    }

    const rowHeaderWidth = isStoryToStoryMode ? 28 : isComponentsMode ? 36 : undefined;

    return {
      cells: [
        {
          key: 'row-header',
          content: <Text weight="medium">Rows</Text>,
          width: rowHeaderWidth,
        },
        ...displayColumns.map((column) => ({
          key: column.key,
          content: (
            <Box xcss={isComponentsMode ? componentHeaderCellStyle : undefined}>
              {isComponentsMode
                ? renderComponentColumnLabel(column, siteUrl, projectKey)
                : renderStoryAxisLabel(mode, column, issueIndex, siteUrl)}
            </Box>
          ),
        })),
      ],
    };
  }, [displayColumns, mode, issueIndex, isStoryToStoryMode, isComponentsMode, siteUrl, projectKey]);

  const tableRows = useMemo(() => {
    return displayRows.map((row) => ({
      key: row.key,
      cells: [
        {
          key: row.key,
          content: (
            <Box>
              {renderStoryAxisLabel(mode, row, issueIndex, siteUrl)}
            </Box>
          ),
        },
        ...displayColumns.map((column) => {
          const cell = cells[row.key]?.[column.key];
          const color = cell ? colorTokens[cell.color] || colorTokens.grey : emptyCellColor;
          const tooltipText = buildCellTooltipText(mode, row, column, cell, issueIndex);
          const onCellClick = () => {
            if (!cell) {
              return;
            }
            setSelectedCell({
              row: row.label,
              rowKey: row.key,
              column: column.label,
              columnKey: column.key,
              issueKeys: cell.issueKeys || [],
              relations: cell.relations || [],
            });
          };

          const cellContent = isStoryToStoryMode ? (
            <Box xcss={storyCellBaseStyle} onClick={onCellClick}>
              {cell ? (
                <Image
                  src={buildStoryFillDataUri(
                    cell.fillStyle,
                    cell.colorHex || '#9E9E9E',
                    STORY_CELL_SIZE
                  )}
                  alt={`${cell.relationType || 'relationship'} dependency`}
                  width={STORY_CELL_SIZE}
                  height={STORY_CELL_SIZE}
                />
              ) : null}
            </Box>
          ) : (
            <Box xcss={cellBaseStyle} backgroundColor={color} onClick={onCellClick} />
          );
          return {
            key: `${row.key}-${column.key}`,
            content: (
              <Box xcss={isComponentsMode ? componentDataCellStyle : undefined}>
                {cell ? (
                  <Tooltip content={tooltipText}>{cellContent}</Tooltip>
                ) : (
                  cellContent
                )}
              </Box>
            ),
          };
        }),
      ],
    }));
  }, [displayRows, displayColumns, cells, mode, issueIndex, isStoryToStoryMode, isComponentsMode]);

  return (
    <Stack space="space.200">
      <Heading size="medium">Tracey</Heading>

      <Inline space="space.100" alignBlock="center">
        <Button
          appearance={mode === 'components' ? 'primary' : 'default'}
          onClick={() => setMode('components')}
        >
          Components View
        </Button>
        <Button
          appearance={mode === 'story-to-story' ? 'primary' : 'default'}
          onClick={() => setMode('story-to-story')}
        >
          Story-to-Story View
        </Button>
        <Button onClick={() => { void openEnhancedMatrixView(); }} isDisabled={!projectKey}>
          View In Enhanced Mode
        </Button>
        <Button onClick={openInteractiveHierarchyView} isDisabled={!projectKey}>
          Open Interactive Hierarchy
        </Button>
      </Inline>

      <Box xcss={filterPanelStyle}>
        <Stack space="space.100">
          <Box xcss={filterHeaderStyle}>
            <Box xcss={filterHeaderLeftStyle}>
              <Button appearance="subtle" onClick={() => setFiltersExpanded((prev) => !prev)}>
                {filtersExpanded ? '▾' : '▸'}
              </Button>
            </Box>
            <Box xcss={filterHeaderTitleStyle}>
              <Text weight="medium">Filters</Text>
            </Box>
            <Box xcss={filterHeaderActionsStyle}>
              <Box xcss={filterSummaryTextStyle}>
                <Text size="small" color="color.text.subtle">{filterSummaryText}</Text>
              </Box>
            </Box>
          </Box>

          {filtersExpanded && (
            <Stack space="space.100">
              <Inline space="space.100" alignBlock="center" shouldWrap>
                <Box xcss={xcss({ minWidth: '190px' })}>
                  <Select
                    isMulti
                    placeholder="Filter issue types"
                    options={issueTypeOptions}
                    value={selectedIssueTypeOptions}
                    onChange={(value) => {
                      if (!value) {
                        setSelectedIssueTypes([]);
                        return;
                      }
                      const selected = Array.isArray(value) ? value : [value];
                      setSelectedIssueTypes(selected.map((option) => option.value));
                    }}
                  />
                </Box>
                <Box xcss={xcss({ minWidth: '220px' })}>
                  <Select
                    isMulti
                    placeholder="Filter epics"
                    options={epicOptions}
                    value={selectedEpicOptions}
                    onChange={(value) => {
                      if (!value) {
                        setSelectedEpicKeys([]);
                        return;
                      }
                      const selected = Array.isArray(value) ? value : [value];
                      setSelectedEpicKeys(selected.map((option) => option.value));
                    }}
                  />
                </Box>
                <Box xcss={xcss({ minWidth: '200px' })}>
                  <Select
                    isMulti
                    placeholder="Filter fixed versions"
                    options={fixedVersionOptions}
                    value={selectedFixedVersionOptions}
                    onChange={(value) => {
                      if (!value) {
                        setSelectedFixedVersions([]);
                        return;
                      }
                      const selected = Array.isArray(value) ? value : [value];
                      setSelectedFixedVersions(selected.map((option) => option.value));
                    }}
                  />
                </Box>
                <Box xcss={xcss({ minWidth: '200px' })}>
                  <Select
                    isMulti
                    placeholder="Filter labels"
                    options={labelOptions}
                    value={selectedLabelOptions}
                    onChange={(value) => {
                      if (!value) {
                        setSelectedLabels([]);
                        return;
                      }
                      const selected = Array.isArray(value) ? value : [value];
                      setSelectedLabels(selected.map((option) => option.value));
                    }}
                  />
                </Box>
                <Box xcss={xcss({ minWidth: '220px' })}>
                  <Select
                    isMulti
                    placeholder="Filter components"
                    options={componentOptions}
                    value={selectedComponentOptions}
                    onChange={(value) => {
                      if (!value) {
                        setSelectedComponents([]);
                        return;
                      }
                      const selected = Array.isArray(value) ? value : [value];
                      setSelectedComponents(selected.map((option) => option.value));
                    }}
                  />
                </Box>
                <Box xcss={xcss({ minWidth: '200px' })}>
                  <Textfield
                    placeholder="Optional JQL"
                    value={jql}
                    onChange={(event) => setJql(event.target.value)}
                  />
                </Box>
                {isStoryToStoryMode && (
                  <Checkbox
                    label="Related only"
                    value="related-only"
                    isChecked={relatedOnly}
                    onChange={(event) => setRelatedOnly(Boolean(event?.target?.checked))}
                  />
                )}
              </Inline>
            </Stack>
          )}

          <Inline space="space.100" alignBlock="center" shouldWrap={false}>
            {legendItems.map((item) => (
              <Inline key={item.label} space="space.050" alignBlock="center">
                {item.colorHex ? (
                  <Image
                    src={buildStoryFillDataUri(
                      item.fillStyle,
                      item.colorHex,
                      LEGEND_SWATCH_SIZE
                    )}
                    alt={item.label}
                    width={LEGEND_SWATCH_SIZE}
                    height={LEGEND_SWATCH_SIZE}
                  />
                ) : (
                  <Box xcss={legendItemStyle} backgroundColor={colorTokens[item.color]} />
                )}
                <Text size="small">{item.label}</Text>
              </Inline>
            ))}
            <Button appearance="primary" onClick={loadMatrix} isDisabled={loading}>
              Refresh
            </Button>
          </Inline>
        </Stack>
      </Box>

      {error && (
        <SectionMessage appearance="error">
          <Text>{error}</Text>
        </SectionMessage>
      )}

      {loading && (
        <Box padding="space.200">
          <Spinner />
        </Box>
      )}

      {!loading && data && (
        <Stack space="space.100">
          <Inline space="space.100" alignBlock="center">
            <Badge>{data.issueCount} issues loaded</Badge>
            {data.truncated && (
              <Badge appearance="warning">Results truncated at 2,000 issues</Badge>
            )}
            <Text size="small">JQL: {data.jql}</Text>
          </Inline>

          {isHierarchicalMode ? (
            <Stack space="space.150">
              {!hierarchyGraphic && lonelyIssueKeys.length === 0 ? (
                <SectionMessage appearance="info">
                  <Text>No hierarchy or standalone issues found for the selected filters.</Text>
                </SectionMessage>
              ) : (
                <Stack space="space.150">
                  {hierarchyGraphic && (
                    <Stack space="space.100">
                      <Inline space="space.100" alignBlock="center">
                        <Text size="small">Zoom: {hierarchyZoom}%</Text>
                        <Button
                          onClick={zoomOutHierarchy}
                          isDisabled={hierarchyZoom <= HIERARCHY_ZOOM_MIN}
                        >
                          Zoom out
                        </Button>
                        <Button
                          onClick={zoomInHierarchy}
                          isDisabled={hierarchyZoom >= HIERARCHY_ZOOM_MAX}
                        >
                          Zoom in
                        </Button>
                        <Button onClick={resetHierarchyZoom} isDisabled={hierarchyZoom === 100}>
                          Reset
                        </Button>
                      </Inline>
                      <Stack space="space.050">
                        <Text size="small">Horizontal scroll</Text>
                        <Range
                          min={HIERARCHY_PAN_MIN}
                          max={HIERARCHY_PAN_MAX}
                          step={1}
                          value={hierarchyPanX}
                          onChange={setHierarchyPanX}
                          isDisabled={hierarchyZoom <= 100}
                        />
                      </Stack>
                      <Stack space="space.050">
                        <Text size="small">Vertical scroll</Text>
                        <Range
                          min={HIERARCHY_PAN_MIN}
                          max={HIERARCHY_PAN_MAX}
                          step={1}
                          value={hierarchyPanY}
                          onChange={setHierarchyPanY}
                          isDisabled={hierarchyZoom <= 100}
                        />
                      </Stack>
                      <Box xcss={hierarchyViewportStyle}>
                        <Image
                          src={hierarchyGraphic.src}
                          width={hierarchyGraphic.width}
                          height={hierarchyGraphic.height}
                          alt="Hierarchical issue relationship map"
                        />
                      </Box>
                    </Stack>
                  )}

                  {horizontalEdges.length > 0 && (
                    <Box xcss={panelCardStyle}>
                      <Stack space="space.075">
                        <Text weight="medium">Horizontal Issue Links</Text>
                        {horizontalEdgePreview.map((edge, index) => {
                          const fromHref = siteUrl ? `${siteUrl}/browse/${edge.from}` : null;
                          const toHref = siteUrl ? `${siteUrl}/browse/${edge.to}` : null;
                          const typeText = (edge.types || []).join(', ') || 'Link';
                          return (
                            <Inline key={`${edge.from}-${edge.to}-${index}`} space="space.050" alignBlock="center">
                              {fromHref ? <Link href={fromHref} openNewTab>{edge.from}</Link> : <Text>{edge.from}</Text>}
                              <Text size="small">{'<->'}</Text>
                              {toHref ? <Link href={toHref} openNewTab>{edge.to}</Link> : <Text>{edge.to}</Text>}
                              <Text size="small" color="color.text.subtle">[{typeText}]</Text>
                            </Inline>
                          );
                        })}
                        {horizontalEdges.length > horizontalEdgePreview.length && (
                          <Text size="small" color="color.text.subtle">
                            Showing {horizontalEdgePreview.length} of {horizontalEdges.length} horizontal links.
                          </Text>
                        )}
                      </Stack>
                    </Box>
                  )}

                  {lonelyIssueKeys.length > 0 && (
                    <Box xcss={panelCardStyle}>
                      <Stack space="space.100">
                        <Text weight="medium">Standalone Issues (No hierarchy or links)</Text>
                        <Inline space="space.100" shouldWrap>
                          {lonelyIssueKeys.map((key) => {
                            const issue = issueIndex[key] || {};
                            const href = siteUrl ? `${siteUrl}/browse/${key}` : null;
                            const summary = truncateText(issue.summary || 'No summary', 64);
                            return (
                              <Box key={key} xcss={standaloneIssueCardStyle}>
                                <Stack space="space.050">
                                  {href ? (
                                    <Link href={href} openNewTab>
                                      <Text weight="medium">{key}</Text>
                                    </Link>
                                  ) : (
                                    <Text weight="medium">{key}</Text>
                                  )}
                                  <Text size="small">{summary}</Text>
                                  <Text size="small" color="color.text.subtle">
                                    Status: {issue.status || 'No status'}
                                  </Text>
                                  <Text size="small" color="color.text.subtle">
                                    Priority: {issue.priority || 'No priority'}
                                  </Text>
                                </Stack>
                              </Box>
                            );
                          })}
                        </Inline>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              )}
            </Stack>
          ) : displayRows.length === 0 || displayColumns.length === 0 ? (
            <SectionMessage appearance="info">
              <Text>
                {isStoryToStoryMode && relatedOnly
                  ? 'No related story dependencies found for the selected filters.'
                  : 'No rows or columns found for the selected filters.'}
              </Text>
            </SectionMessage>
          ) : (
            <Box xcss={scrollContainerStyle}>
              <DynamicTable
                head={head}
                rows={tableRows}
                page={isStoryToStoryMode ? storyToStoryPage : undefined}
                onSetPage={isStoryToStoryMode ? setStoryToStoryPage : undefined}
                rowsPerPage={isStoryToStoryMode ? STORY_TO_STORY_ROWS_PER_PAGE : undefined}
              />
            </Box>
          )}
        </Stack>
      )}

      {selectedCell && (
        <ModalDialog
          header={`Issues for ${selectedCell.row} × ${selectedCell.column}`}
          onClose={() => setSelectedCell(null)}
        >
          <Stack space="space.100">
            {isStoryToStoryMode && (
              <Stack space="space.050">
                <Text weight="medium">Relations</Text>
                {selectedCell.relations && selectedCell.relations.length > 0 ? (
                  selectedCell.relations.map((relation, index) => {
                    const relationType = relation.typeName || relation.type || 'Relates';
                    const relationDirection = relation.direction || 'relates to';
                    return (
                      <Text key={`${relationType}-${relationDirection}-${index}`} size="small">
                        {index + 1}. {selectedCell.rowKey} {relationDirection} {selectedCell.columnKey}{' '}
                        [{relationType}]
                      </Text>
                    );
                  })
                ) : (
                  <Text size="small" color="color.text.subtle">
                    No link relations available for this pair.
                  </Text>
                )}
              </Stack>
            )}
            {selectedCell.issueKeys.map((key) => {
              const issue = issueIndex[key];
              const label = issue ? `${key} — ${issue.summary}` : key;
              const href = siteUrl ? `${siteUrl}/browse/${key}` : undefined;
              return (
                <Box key={key}>
                  {href ? (
                    <Link href={href}>{label}</Link>
                  ) : (
                    <Text>{label}</Text>
                  )}
                </Box>
              );
            })}
          </Stack>
        </ModalDialog>
      )}
    </Stack>
  );
}

function IssuePanel({ context }) {
  const issueKey = context.extension?.issue?.key || context.issueKey;
  const siteUrl = context.siteUrl;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    invoke('getIssuePanelData', { issueKey })
      .then((result) => {
        if (!mounted) {
          return;
        }
        setData(result);
      })
      .catch((err) => {
        if (!mounted) {
          return;
        }
        setError(err.message || 'Failed to load issue data.');
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [issueKey]);

  if (loading) {
    return (
      <Box padding="space.200">
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <SectionMessage appearance="error">
        <Text>{error}</Text>
      </SectionMessage>
    );
  }

  if (!data) {
    return (
      <SectionMessage appearance="info">
        <Text>No data available.</Text>
      </SectionMessage>
    );
  }

  return (
    <Stack space="space.200">
      <Heading size="medium">Tracey</Heading>
      <Inline space="space.100" alignBlock="center">
        <Badge>
          {data.completeness.filledFields}/{data.completeness.totalFields} fields filled
        </Badge>
        <Badge>{data.completeness.linkedIssueCount} linked issues</Badge>
      </Inline>

      <Stack space="space.150">
        {data.fieldValues.map((field) => (
          <Box key={field.name} xcss={panelCardStyle}>
            <Stack space="space.050">
              <Text weight="medium">{field.name}</Text>
              {field.values.length === 0 ? (
                <Text size="small" color="color.text.subtle">
                  No values
                </Text>
              ) : (
                <Inline space="space.050" alignBlock="center">
                  {field.values.map((value) => (
                    <Tag key={value} text={value} />
                  ))}
                </Inline>
              )}
            </Stack>
          </Box>
        ))}
      </Stack>

      <Stack space="space.150">
        <Heading size="small">Linked issues</Heading>
        {data.linkGroups.length === 0 ? (
          <Text size="small" color="color.text.subtle">
            No linked issues.
          </Text>
        ) : (
          data.linkGroups.map((group) => (
            <Box key={group.typeName} xcss={panelCardStyle}>
              <Stack space="space.050">
                <Text weight="medium">{group.typeName}</Text>
                {group.issues.map((issue) => {
                  const label = issue.summary ? `${issue.key} — ${issue.summary}` : issue.key;
                  const href = siteUrl ? `${siteUrl}/browse/${issue.key}` : undefined;
                  return (
                    <Inline key={issue.key} space="space.050" alignBlock="center">
                      {href ? <Link href={href}>{label}</Link> : <Text>{label}</Text>}
                      {issue.direction ? (
                        <Text size="small" color="color.text.subtle">
                          ({issue.direction})
                        </Text>
                      ) : null}
                    </Inline>
                  );
                })}
              </Stack>
            </Box>
          ))
        )}
      </Stack>
    </Stack>
  );
}

function AdminPage() {
  const [issueTypes, setIssueTypes] = useState([]);
  const [linkTypes, setLinkTypes] = useState([]);
  const [storyTypeIds, setStoryTypeIds] = useState([]);
  const [linkTypeColorMap, setLinkTypeColorMap] = useState({
    test: [],
    bug: [],
    requirement: [],
  });
  const [fieldInfo, setFieldInfo] = useState(null);
  const [status, setStatus] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.all([invoke('getIssueTypes'), invoke('getLinkTypes'), invoke('getConfig'), invoke('getFieldInfo')])
      .then(([types, linkTypesResult, config, fields]) => {
        if (!mounted) {
          return;
        }
        setIssueTypes(types);
        setLinkTypes(linkTypesResult);
        setStoryTypeIds(config.storyTypeIds || []);
        setLinkTypeColorMap(config.linkTypeColorMap || { test: [], bug: [], requirement: [] });
        setFieldInfo(fields);
      })
      .catch((err) => {
        if (!mounted) {
          return;
        }
        setStatus({ appearance: 'error', message: err.message || 'Failed to load config.' });
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const issueTypeOptions = useMemo(
    () => issueTypes.map((type) => ({ label: type.name, value: type.id })),
    [issueTypes]
  );

  const linkTypeOptions = useMemo(
    () => linkTypes.map((type) => ({ label: type.name, value: type.name })),
    [linkTypes]
  );

  const storyTypeSelections = useMemo(
    () => issueTypeOptions.filter((option) => storyTypeIds.includes(option.value)),
    [issueTypeOptions, storyTypeIds]
  );

  const linkTypeSelections = (category) =>
    linkTypeOptions.filter((option) => (linkTypeColorMap[category] || []).includes(option.value));

  const saveConfig = async () => {
    setStatus(null);
    try {
      await invoke('setConfig', {
        storyTypeIds,
        linkTypeColorMap,
      });
      setStatus({ appearance: 'success', message: 'Configuration saved.' });
    } catch (err) {
      setStatus({ appearance: 'error', message: err.message || 'Failed to save configuration.' });
    }
  };

  const provisionFields = async () => {
    setStatus(null);
    try {
      const fields = await invoke('ensureCustomFields');
      setFieldInfo(fields);
      setStatus({ appearance: 'success', message: 'Custom fields provisioned.' });
    } catch (err) {
      setStatus({ appearance: 'error', message: err.message || 'Failed to provision fields.' });
    }
  };

  if (loading) {
    return (
      <Box padding="space.200">
        <Spinner />
      </Box>
    );
  }

  return (
    <Stack space="space.200">
      <Heading size="medium">Tracey Configuration</Heading>

      {status && (
        <SectionMessage appearance={status.appearance}>
          <Text>{status.message}</Text>
        </SectionMessage>
      )}

      <Box xcss={panelCardStyle}>
        <Stack space="space.150">
          <Text weight="medium">Story issue types</Text>
          <Select
            isMulti
            options={issueTypeOptions}
            value={storyTypeSelections}
            onChange={(value) => {
              if (!value) {
                setStoryTypeIds([]);
                return;
              }
              const selections = Array.isArray(value) ? value : [value];
              setStoryTypeIds(selections.map((option) => option.value));
            }}
          />
        </Stack>
      </Box>

      <Box xcss={panelCardStyle}>
        <Stack space="space.150">
          <Text weight="medium">Optional link type overrides</Text>
          <Text size="small" color="color.text.subtle">
            Map link types to colors if you want to override the default "linked issue type" logic.
          </Text>

          <Stack space="space.100">
            <Text size="small">Green (Test)</Text>
            <Select
              isMulti
              options={linkTypeOptions}
              value={linkTypeSelections('test')}
              onChange={(value) => {
                const selections = Array.isArray(value) ? value : value ? [value] : [];
                setLinkTypeColorMap((prev) => ({
                  ...prev,
                  test: selections.map((option) => option.value),
                }));
              }}
            />
          </Stack>

          <Stack space="space.100">
            <Text size="small">Orange (Bug)</Text>
            <Select
              isMulti
              options={linkTypeOptions}
              value={linkTypeSelections('bug')}
              onChange={(value) => {
                const selections = Array.isArray(value) ? value : value ? [value] : [];
                setLinkTypeColorMap((prev) => ({
                  ...prev,
                  bug: selections.map((option) => option.value),
                }));
              }}
            />
          </Stack>

          <Stack space="space.100">
            <Text size="small">Blue (Requirement)</Text>
            <Select
              isMulti
              options={linkTypeOptions}
              value={linkTypeSelections('requirement')}
              onChange={(value) => {
                const selections = Array.isArray(value) ? value : value ? [value] : [];
                setLinkTypeColorMap((prev) => ({
                  ...prev,
                  requirement: selections.map((option) => option.value),
                }));
              }}
            />
          </Stack>

          <Inline space="space.100">
            <Button appearance="primary" onClick={saveConfig}>
              Save configuration
            </Button>
          </Inline>
        </Stack>
      </Box>

      <Box xcss={panelCardStyle}>
        <Stack space="space.150">
          <Text weight="medium">Custom field provisioning</Text>
          <Text size="small" color="color.text.subtle">
            The app provisions fields on install. Use this button to re-run provisioning if needed.
          </Text>
          <Inline space="space.100">
            <Button onClick={provisionFields}>Provision fields</Button>
          </Inline>
          {fieldInfo && (
            <Stack space="space.050">
              {Object.entries(fieldInfo).map(([name, id]) => (
                <Text key={name} size="small">
                  {name}: {id}
                </Text>
              ))}
            </Stack>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

ForgeReconciler.render(<App />);
