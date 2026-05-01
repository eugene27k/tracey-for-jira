import { invoke, view } from '@forge/bridge';

const MODES = {
  COMPONENTS: 'components',
  STORY_TO_STORY: 'story-to-story',
  HIERARCHICAL: 'hierarchical',
};

const LEGEND = {
  [MODES.COMPONENTS]: [
    { label: 'Issue linked to component', swatchClass: 'legend-component' },
  ],
  [MODES.STORY_TO_STORY]: [
    { label: 'Blocks (row -> column)', swatchClass: 'legend-blocks-full' },
    { label: 'Is blocked by (column -> row)', swatchClass: 'legend-blocks-diagonal' },
    { label: 'Duplicates / Is duplicated by', swatchClass: 'legend-duplicates-full' },
    { label: 'Clones / Is cloned by', swatchClass: 'legend-clones-full' },
    { label: 'Relates to', swatchClass: 'legend-relates-full' },
  ],
  [MODES.HIERARCHICAL]: [
    { label: 'Parent-child hierarchy', swatchClass: 'legend-relates-full' },
    { label: 'Issue links (optional)', swatchClass: 'legend-blocks-diagonal' },
  ],
};

const ZOOM_MIN = 0.2;
const ZOOM_MAX = 20;
const ROOT_GAP = 96;
const ROOT_ROW_GAP = 132;
const CARD_WIDTH = 300;
const CARD_HEIGHT = 158;
const CARD_GAP_X = 44;
const CARD_GAP_Y = 104;
const CANVAS_MARGIN = 48;
const PAN_PADDING = 80;
const INITIAL_READABLE_ZOOM = 0.55;
const DRAG_GHOST_OFFSET_X = 18;
const DRAG_GHOST_OFFSET_Y = 14;
const DRAG_AUTOPAN_EDGE = 84;
const DRAG_AUTOPAN_MAX_STEP = 24;

const ISSUE_TYPE_PALETTE = [
  { bg: '#23334a', border: '#6ea8ff', text: '#d5e7ff' },
  { bg: '#2a2f1d', border: '#d6b656', text: '#f6e7bd' },
  { bg: '#2d1f35', border: '#b58ce6', text: '#eadbff' },
  { bg: '#1f3230', border: '#54b89b', text: '#c6f0e4' },
  { bg: '#3a261d', border: '#d18a5f', text: '#ffd9c1' },
  { bg: '#2e2d3b', border: '#9c9ec8', text: '#e0e1ff' },
];

const state = {
  context: null,
  siteUrl: '',
  projectKey: '',
  mode: MODES.COMPONENTS,
  issueTypes: [],
  epics: [],
  fixedVersions: [],
  labels: [],
  components: [],
  selectedIssueTypes: [],
  selectedEpicKeys: [],
  selectedFixedVersions: [],
  selectedLabels: [],
  selectedComponents: [],
  jql: '',
  relatedOnly: false,
  showRelations: false,
  data: null,
  loading: false,
  error: '',
  info: '',
  zoom: 1,
  panX: 0,
  panY: 0,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  dragStartPanX: 0,
  dragStartPanY: 0,
  chartDraggedIssueKey: '',
  chartDragPointerId: null,
  chartDragStartX: 0,
  chartDragStartY: 0,
  chartDragMoved: false,
  chartPointerX: 0,
  chartPointerY: 0,
  chartDropTargetKey: '',
  chartAutoPanRaf: 0,
  suppressCardClickUntil: 0,
  layout: null,
  cellLookup: new Map(),
};

let successMessageTimer = null;
const elements = {
  projectLabel: document.getElementById('project-label'),
  modeComponentsButton: document.getElementById('mode-components-btn'),
  modeStoryButton: document.getElementById('mode-story-btn'),
  modeHierarchyButton: document.getElementById('mode-hierarchy-btn'),
  filtersPanel: document.getElementById('filters-panel'),
  filtersSummaryText: document.getElementById('filters-summary-text'),
  issueTypeSelect: document.getElementById('issue-type-select'),
  epicSelect: document.getElementById('epic-select'),
  fixedVersionSelect: document.getElementById('fixed-version-select'),
  labelSelect: document.getElementById('label-select'),
  componentSelect: document.getElementById('component-select'),
  jqlInput: document.getElementById('jql-input'),
  relatedOnlyWrap: document.getElementById('related-only-wrap'),
  relatedOnlyCheckbox: document.getElementById('related-only-checkbox'),
  resetFiltersButton: document.getElementById('reset-filters-btn'),
  refreshButton: document.getElementById('refresh-btn'),
  legend: document.getElementById('legend'),
  stats: document.getElementById('stats'),
  status: document.getElementById('status'),
  matrixWrap: document.getElementById('matrix-wrap'),
  matrixScroll: document.getElementById('matrix-scroll'),
  matrixTable: document.getElementById('matrix-table'),
  emptyState: document.getElementById('empty-state'),
  hierarchyPanel: document.getElementById('hierarchy-panel'),
  hierarchyViewport: document.getElementById('hierarchy-viewport'),
  hierarchyStage: document.getElementById('hierarchy-stage'),
  hierarchyEdges: document.getElementById('hierarchy-edges'),
  hierarchyEmptyState: document.getElementById('hierarchy-empty-state'),
  zoomOutButton: document.getElementById('zoom-out-btn'),
  zoomInButton: document.getElementById('zoom-in-btn'),
  resetViewButton: document.getElementById('reset-view-btn'),
  fitViewButton: document.getElementById('fit-view-btn'),
  fullscreenButton: document.getElementById('fullscreen-btn'),
  showRelationsCheckbox: document.getElementById('show-relations-checkbox'),
  zoomLabel: document.getElementById('zoom-label'),
  coverageWidget: document.getElementById('coverage-widget'),
  coverageBar: document.getElementById('coverage-bar'),
  coverageBarFill: document.getElementById('coverage-bar-fill'),
  coveragePercent: document.getElementById('coverage-percent'),
  coverageDetails: document.getElementById('coverage-details'),
  coverageBreakdown: document.getElementById('coverage-breakdown'),
  lonelySection: document.getElementById('lonely-section'),
  lonelyRows: document.getElementById('lonely-rows'),
  dragGhost: document.getElementById('chart-drag-ghost'),
  modal: document.getElementById('cell-modal'),
  modalTitle: document.getElementById('modal-title'),
  modalBody: document.getElementById('modal-body'),
  modalCloseButton: document.getElementById('modal-close-btn'),
};

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJqlValue(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function truncate(value, maxLength) {
  const text = String(value || '');
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hashString(value) {
  const text = String(value || '');
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getIssueTypeColors(issueType) {
  const paletteIndex = hashString(issueType || 'issue') % ISSUE_TYPE_PALETTE.length;
  return ISSUE_TYPE_PALETTE[paletteIndex];
}

function sortByLabel(a, b) {
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function dedupeStringsByNormalized(values) {
  const seen = new Set();
  const result = [];
  for (const value of values || []) {
    const text = String(value || '').trim();
    if (!text) {
      continue;
    }
    const normalized = text.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(text);
  }
  return result;
}

function selectedValues(select) {
  return Array.from(select.selectedOptions || []).map((option) => option.value);
}

function enableToggleMultiSelect(select) {
  if (!select) {
    return;
  }

  select.addEventListener('mousedown', (event) => {
    const option = event.target;
    if (!option || option.tagName !== 'OPTION') {
      return;
    }

    event.preventDefault();
    option.selected = !option.selected;
    select.focus();
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

function renderSelectOptions(select, options, selected) {
  const selectedSet = new Set(selected || []);
  select.innerHTML = options
    .map((option) => {
      const isSelected = selectedSet.has(option.value) ? ' selected' : '';
      return `<option value="${escapeHtml(option.value)}"${isSelected}>${escapeHtml(option.label)}</option>`;
    })
    .join('');
}

function normalizeMode(mode) {
  if (mode === MODES.STORY_TO_STORY) {
    return MODES.STORY_TO_STORY;
  }
  if (mode === MODES.HIERARCHICAL) {
    return MODES.HIERARCHICAL;
  }
  return MODES.COMPONENTS;
}

function isModeSupported(mode) {
  return mode === MODES.COMPONENTS || mode === MODES.STORY_TO_STORY || mode === MODES.HIERARCHICAL;
}

function setStatus(type, message) {
  if (!message) {
    elements.status.className = 'status hidden';
    elements.status.textContent = '';
    return;
  }

  elements.status.className = `status ${type}`;
  elements.status.textContent = message;
}

function showSuccessMessage(message, timeoutMs = 2000) {
  if (successMessageTimer) {
    clearTimeout(successMessageTimer);
    successMessageTimer = null;
  }
  setStatus('success', message);
  successMessageTimer = window.setTimeout(() => {
    setStatus('', '');
    successMessageTimer = null;
  }, timeoutMs);
}

function renderLegend() {
  const items = LEGEND[state.mode] || [];
  elements.legend.innerHTML = items
    .map((item) => {
      return `
        <div class="legend-item">
          <span class="legend-swatch ${escapeHtml(item.swatchClass || '')}"></span>
          <span>${escapeHtml(item.label)}</span>
        </div>
      `;
    })
    .join('');
}

function summarizeFilters() {
  const parts = [];
  if (state.selectedIssueTypes.length > 0) {
    parts.push(`${state.selectedIssueTypes.length} issue types`);
  }
  if (state.selectedEpicKeys.length > 0) {
    parts.push(`${state.selectedEpicKeys.length} epics`);
  }
  if (state.selectedFixedVersions.length > 0) {
    parts.push(`${state.selectedFixedVersions.length} versions`);
  }
  if (state.selectedLabels.length > 0) {
    parts.push(`${state.selectedLabels.length} labels`);
  }
  if (state.selectedComponents.length > 0) {
    parts.push(`${state.selectedComponents.length} components`);
  }
  if (String(state.jql || '').trim()) {
    parts.push('JQL');
  }
  if (state.mode === MODES.STORY_TO_STORY && state.relatedOnly) {
    parts.push('Related only');
  }
  return parts.length > 0 ? parts.join(' • ') : 'No filters';
}

function syncControlsToState() {
  state.selectedIssueTypes = dedupeStringsByNormalized(selectedValues(elements.issueTypeSelect));
  state.selectedEpicKeys = selectedValues(elements.epicSelect);
  state.selectedFixedVersions = selectedValues(elements.fixedVersionSelect);
  state.selectedLabels = selectedValues(elements.labelSelect);
  state.selectedComponents = selectedValues(elements.componentSelect);
  state.jql = elements.jqlInput.value || '';
  state.relatedOnly = Boolean(elements.relatedOnlyCheckbox.checked);
  state.showRelations = Boolean(elements.showRelationsCheckbox?.checked);
  elements.filtersSummaryText.textContent = summarizeFilters();
}

function syncStateToControls() {
  const issueTypeNames = dedupeStringsByNormalized(
    (state.issueTypes || []).map((type) => type.name)
  ).sort(sortByLabel);

  renderSelectOptions(
    elements.issueTypeSelect,
    issueTypeNames.map((name) => ({ value: name, label: name })),
    dedupeStringsByNormalized(state.selectedIssueTypes)
  );

  renderSelectOptions(
    elements.epicSelect,
    (state.epics || []).map((epic) => ({
      value: epic.key,
      label: epic.summary ? `${epic.key} - ${epic.summary}` : epic.key,
    })),
    state.selectedEpicKeys
  );

  renderSelectOptions(
    elements.fixedVersionSelect,
    (state.fixedVersions || []).map((version) => ({
      value: version.name,
      label: version.name,
    })),
    state.selectedFixedVersions
  );

  renderSelectOptions(
    elements.labelSelect,
    (state.labels || []).map((label) => ({ value: label, label })),
    state.selectedLabels
  );

  renderSelectOptions(
    elements.componentSelect,
    (state.components || []).map((component) => ({ value: component, label: component })),
    state.selectedComponents
  );

  elements.jqlInput.value = state.jql;
  elements.relatedOnlyCheckbox.checked = Boolean(state.relatedOnly);
  elements.showRelationsCheckbox.checked = Boolean(state.showRelations);
  elements.filtersSummaryText.textContent = summarizeFilters();
  renderModeButtons();
  renderLegend();
}

function renderModeButtons() {
  const isComponents = state.mode === MODES.COMPONENTS;
  const isStory = state.mode === MODES.STORY_TO_STORY;
  const isHierarchy = state.mode === MODES.HIERARCHICAL;
  elements.modeComponentsButton.classList.toggle('active-mode', isComponents);
  elements.modeStoryButton.classList.toggle('active-mode', isStory);
  elements.modeHierarchyButton.classList.toggle('active-mode', isHierarchy);
  elements.relatedOnlyWrap.style.display = isStory ? 'inline-flex' : 'none';
}

function resetFilters() {
  state.selectedIssueTypes = [];
  state.selectedEpicKeys = [];
  state.selectedFixedVersions = [];
  state.selectedLabels = [];
  state.selectedComponents = [];
  state.jql = '';
  state.relatedOnly = false;
  syncStateToControls();
}

function getIssueLabel(issueKey, summaryMaxLength) {
  const issue = state.data?.issueIndex?.[issueKey];
  if (!issue) {
    return issueKey;
  }
  const shortSummary = truncate(issue.summary || '', summaryMaxLength);
  return shortSummary ? `${issue.key} | ${shortSummary}` : issue.key;
}

function getVisibleMatrix() {
  const rows = Array.isArray(state.data?.rows) ? state.data.rows : [];
  const columns = Array.isArray(state.data?.columns) ? state.data.columns : [];
  const cells = state.data?.cells || {};

  if (state.mode !== MODES.STORY_TO_STORY || !state.relatedOnly) {
    return { rows, columns, cells };
  }

  const relatedKeys = new Set();
  for (const [rowKey, rowCells] of Object.entries(cells || {})) {
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
    cells,
  };
}

function buildCellTooltip(row, column, cell) {
  if (!cell) {
    return '';
  }

  if (state.mode === MODES.COMPONENTS) {
    const rowIssue = state.data?.issueIndex?.[row.key] || { key: row.key, summary: '' };
    const summary = rowIssue.summary ? ` | ${rowIssue.summary}` : '';
    return `${rowIssue.key}${summary} <-> ${column.label}`;
  }

  const rowIssue = state.data?.issueIndex?.[row.key] || { key: row.key };
  const columnIssue = state.data?.issueIndex?.[column.key] || { key: column.key };
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

function renderStats() {
  if (!state.data) {
    elements.stats.textContent = '';
    renderCoverageWidget();
    return;
  }
  const loaded = Number.isFinite(state.data.issueCount) ? state.data.issueCount : 0;
  const total = Number.isFinite(state.data.totalIssues) ? state.data.totalIssues : loaded;
  const truncatedText = state.data.truncated ? ' • truncated to 2,000' : '';
  elements.stats.textContent = `${loaded}/${total} issues • ${state.data.jql || ''}${truncatedText}`;
  renderCoverageWidget();
}

function computeCoverage() {
  const issueIndex = state.data?.issueIndex || {};
  const nodeMeta = state.data?.hierarchy?.nodeMeta || {};
  const nonEpicKeys = Object.keys(issueIndex).filter(
    (key) => !isEpicIssueType(issueIndex[key]?.issueType)
  );

  const total = nonEpicKeys.length;
  if (total === 0) {
    return { total: 0, assigned: 0, unassigned: 0, percent: 0 };
  }

  let assigned = 0;
  for (const key of nonEpicKeys) {
    if (nodeMeta[key]?.parentKey) {
      assigned += 1;
    }
  }

  const unassigned = total - assigned;
  const percent = Math.round((assigned / total) * 100);
  return { total, assigned, unassigned, percent };
}

function renderCoverageWidget() {
  if (!elements.coverageWidget) {
    return;
  }

  if (state.mode !== MODES.HIERARCHICAL || !state.data) {
    elements.coverageWidget.classList.add('hidden');
    return;
  }

  const coverage = computeCoverage();
  const percent = clamp(coverage.percent, 0, 100);
  elements.coverageWidget.classList.remove('hidden');

  if (elements.coverageBarFill) {
    elements.coverageBarFill.style.width = `${percent}%`;
  }

  if (elements.coverageBar) {
    elements.coverageBar.setAttribute('aria-valuemin', '0');
    elements.coverageBar.setAttribute('aria-valuemax', '100');
    elements.coverageBar.setAttribute('aria-valuenow', String(percent));
    elements.coverageBar.setAttribute(
      'aria-label',
      `Parent coverage ${percent} percent (${coverage.assigned} assigned, ${coverage.unassigned} unassigned)`
    );
  }

  if (elements.coveragePercent) {
    elements.coveragePercent.textContent = `${percent}%`;
  }
  if (elements.coverageDetails) {
    elements.coverageDetails.textContent = `Assigned ${coverage.assigned} of ${coverage.total} non-epic issues`;
  }
  if (elements.coverageBreakdown) {
    elements.coverageBreakdown.textContent = `${coverage.assigned} assigned • ${coverage.unassigned} unassigned`;
  }
}

function renderComponentColumnHeader(column) {
  const label = column.label || column.key;
  const text = truncate(label, 40);
  const jql = `project = "${escapeJqlValue(state.projectKey)}" AND "Affected Components" in ("${escapeJqlValue(label)}")`;
  const href = state.siteUrl
    ? `${state.siteUrl}/issues/?jql=${encodeURIComponent(jql)}`
    : '';

  if (!href) {
    return `<span class="col-link" title="${escapeHtml(label)}">${escapeHtml(text)}</span>`;
  }

  return `<a class="col-link" href="${escapeHtml(href)}" target="_blank" rel="noopener" title="${escapeHtml(label)}">${escapeHtml(text)}</a>`;
}

function renderIssueLink(issueKey, summaryLength) {
  const label = getIssueLabel(issueKey, summaryLength);
  const href = buildIssueHref(issueKey);

  if (!href) {
    return `<span class="row-link" title="${escapeHtml(label)}">${escapeHtml(label)}</span>`;
  }

  return `<a class="row-link" href="${escapeHtml(href)}" target="_blank" rel="noopener" title="${escapeHtml(label)}">${escapeHtml(label)}</a>`;
}

function buildIssueHref(issueKey) {
  if (!state.siteUrl || !issueKey) {
    return '';
  }
  return `${state.siteUrl}/browse/${issueKey}`;
}

function getStoryRenderItems(cell) {
  const renderItems = Array.isArray(cell?.renderItems)
    ? cell.renderItems
        .filter((item) => item)
        .map((item) => ({
          type: item.type || 'relation',
          fillStyle: item.fillStyle === 'diagonal' ? 'diagonal' : 'full',
        }))
    : [];

  if (renderItems.length > 0) {
    const nonRelates = renderItems.filter((item) => item.type !== 'relates');
    return nonRelates.length > 0 ? nonRelates : renderItems;
  }
  if (!cell) {
    return [];
  }

  const fallback = [
    {
      type: cell.relationType || 'relation',
      fillStyle: cell.fillStyle === 'diagonal' ? 'diagonal' : 'full',
    },
  ];
  const nonRelates = fallback.filter((item) => item.type !== 'relates');
  return nonRelates.length > 0 ? nonRelates : fallback;
}

function normalizeStoryTypeClass(type) {
  switch (String(type || '').toLowerCase()) {
    case 'blocks':
      return 'type-blocks';
    case 'duplicates':
      return 'type-duplicates';
    case 'clones':
      return 'type-clones';
    case 'relates':
      return 'type-relates';
    default:
      return 'type-relates';
  }
}

function renderMatrixTable() {
  elements.matrixTable.innerHTML = '';
  state.cellLookup.clear();

  if (!state.data) {
    elements.emptyState.classList.remove('hidden');
    elements.emptyState.textContent = 'No data.';
    elements.matrixScroll.classList.add('hidden');
    return;
  }

  const matrix = getVisibleMatrix();
  const rows = matrix.rows || [];
  const columns = matrix.columns || [];

  if (rows.length === 0 || columns.length === 0) {
    const emptyMessage =
      state.mode === MODES.STORY_TO_STORY && state.relatedOnly
        ? 'No related story dependencies found for the selected filters.'
        : 'No rows or columns found for the selected filters.';
    elements.emptyState.classList.remove('hidden');
    elements.emptyState.textContent = emptyMessage;
    elements.matrixScroll.classList.add('hidden');
    return;
  }

  elements.emptyState.classList.add('hidden');
  elements.matrixScroll.classList.remove('hidden');

  const table = elements.matrixTable;
  const thead = table.createTHead();
  const headRow = thead.insertRow();

  const corner = document.createElement('th');
  corner.className = 'corner-cell';
  corner.textContent = 'Rows';
  headRow.appendChild(corner);

  for (const column of columns) {
    const th = document.createElement('th');
    th.className = 'col-header';
    if (state.mode === MODES.COMPONENTS) {
      th.innerHTML = renderComponentColumnHeader(column);
    } else {
      th.innerHTML = renderIssueLink(column.key, 32);
    }
    headRow.appendChild(th);
  }

  const tbody = table.createTBody();
  const cells = matrix.cells || {};

  for (const row of rows) {
    const tr = tbody.insertRow();

    const rowHeader = document.createElement('th');
    rowHeader.className = 'sticky-col';
    rowHeader.scope = 'row';
    rowHeader.innerHTML = renderIssueLink(row.key, 50);
    tr.appendChild(rowHeader);

    for (const column of columns) {
      const td = tr.insertCell();
      td.className = 'matrix-data-cell';

      const wrap = document.createElement('div');
      wrap.className = 'cell-wrap';

      const cell = cells[row.key]?.[column.key] || null;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cell-btn';
      button.title = buildCellTooltip(row, column, cell);

      if (cell) {
        button.classList.add('clickable');
        button.dataset.rowKey = row.key;
        button.dataset.columnKey = column.key;
        state.cellLookup.set(`${row.key}::${column.key}`, { row, column, cell });

        if (state.mode === MODES.COMPONENTS) {
          button.classList.add('component', 'full');
        } else {
          button.classList.add('story');
          const renderItems = getStoryRenderItems(cell);
          if (renderItems.length <= 1) {
            const firstItem = renderItems[0] || { type: 'relates', fillStyle: 'full' };
            button.classList.add(normalizeStoryTypeClass(firstItem.type));
            button.classList.add(firstItem.fillStyle === 'diagonal' ? 'diagonal' : 'full');
          } else {
            button.classList.add('story-multi');
            button.innerHTML = renderItems
              .map((item) => {
                const chipClass = item.fillStyle === 'diagonal' ? 'diagonal' : 'full';
                return `<span class="cell-chip ${normalizeStoryTypeClass(item.type)} ${chipClass}" aria-hidden="true"></span>`;
              })
              .join('');
          }
        }
      }

      wrap.appendChild(button);
      td.appendChild(wrap);
    }
  }
}

function computeHierarchyLayout(hierarchy) {
  const nodeMeta = hierarchy?.nodeMeta || {};
  const fallbackKeys = (hierarchy?.levels || []).flatMap((level) => level.issueKeys || []);
  const allNodeKeys = (Object.keys(nodeMeta).length > 0 ? Object.keys(nodeMeta) : fallbackKeys)
    .filter(Boolean)
    .sort(sortByLabel);

  if (allNodeKeys.length === 0) {
    return null;
  }

  const nodeSet = new Set(allNodeKeys);
  const childMap = {};
  const parentMap = {};

  for (const key of allNodeKeys) {
    const children = Array.isArray(nodeMeta[key]?.childKeys) ? nodeMeta[key].childKeys : [];
    childMap[key] = children.filter((childKey) => nodeSet.has(childKey)).sort(sortByLabel);
    const parentKey = nodeMeta[key]?.parentKey;
    parentMap[key] = parentKey && nodeSet.has(parentKey) ? parentKey : null;
  }

  const rootKeys = allNodeKeys.filter((key) => !parentMap[key]).sort(sortByLabel);
  const effectiveRoots = rootKeys.length > 0 ? rootKeys : allNodeKeys;
  const levelHeight = CARD_HEIGHT + CARD_GAP_Y;

  const widthCache = new Map();
  const widthStack = new Set();
  const subtreeWidth = (key) => {
    if (widthCache.has(key)) {
      return widthCache.get(key);
    }
    if (widthStack.has(key)) {
      return CARD_WIDTH;
    }
    widthStack.add(key);

    const children = childMap[key] || [];
    let width = CARD_WIDTH;
    if (children.length > 0) {
      let childWidth = 0;
      for (let index = 0; index < children.length; index += 1) {
        if (index > 0) {
          childWidth += CARD_GAP_X;
        }
        childWidth += subtreeWidth(children[index]);
      }
      width = Math.max(CARD_WIDTH, childWidth);
    }

    widthStack.delete(key);
    widthCache.set(key, width);
    return width;
  };

  const depthCache = new Map();
  const depthStack = new Set();
  const subtreeDepth = (key) => {
    if (depthCache.has(key)) {
      return depthCache.get(key);
    }
    if (depthStack.has(key)) {
      return 1;
    }
    depthStack.add(key);

    const children = childMap[key] || [];
    let depth = 1;
    for (const childKey of children) {
      depth = Math.max(depth, 1 + subtreeDepth(childKey));
    }

    depthStack.delete(key);
    depthCache.set(key, depth);
    return depth;
  };

  const positions = {};
  const assigned = new Set();
  const subtreeNodeCache = new Map();
  const subtreeNodeStack = new Set();

  const assignTree = (key, startX, depth, baseY, recursionStack = new Set()) => {
    if (assigned.has(key)) {
      return;
    }
    if (recursionStack.has(key)) {
      positions[key] = { x: startX, y: baseY + depth * levelHeight };
      assigned.add(key);
      return;
    }

    const nextStack = new Set(recursionStack);
    nextStack.add(key);

    const branchWidth = subtreeWidth(key);
    const y = baseY + depth * levelHeight;
    const children = (childMap[key] || []).filter((childKey) => !assigned.has(childKey));

    if (children.length === 0) {
      positions[key] = {
        x: startX + (branchWidth - CARD_WIDTH) / 2,
        y,
      };
      assigned.add(key);
      return;
    }

    let cursor = startX;
    const childCenters = [];
    for (const childKey of children) {
      const childWidth = subtreeWidth(childKey);
      assignTree(childKey, cursor, depth + 1, baseY, nextStack);
      if (positions[childKey]) {
        childCenters.push(positions[childKey].x + CARD_WIDTH / 2);
      }
      cursor += childWidth + CARD_GAP_X;
    }

    let nodeX = startX + (branchWidth - CARD_WIDTH) / 2;
    if (childCenters.length > 0) {
      const minCenter = Math.min(...childCenters);
      const maxCenter = Math.max(...childCenters);
      nodeX = (minCenter + maxCenter) / 2 - CARD_WIDTH / 2;
    }
    const minX = startX;
    const maxX = startX + branchWidth - CARD_WIDTH;
    nodeX = clamp(nodeX, minX, maxX);

    positions[key] = { x: nodeX, y };
    assigned.add(key);
  };

  const collectSubtreeNodes = (key) => {
    if (subtreeNodeCache.has(key)) {
      return subtreeNodeCache.get(key);
    }
    if (subtreeNodeStack.has(key)) {
      return new Set([key]);
    }
    subtreeNodeStack.add(key);

    const subtree = new Set([key]);
    const children = childMap[key] || [];
    for (const childKey of children) {
      const childSubtree = collectSubtreeNodes(childKey);
      for (const nodeKey of childSubtree) {
        subtree.add(nodeKey);
      }
    }
    subtreeNodeStack.delete(key);
    subtreeNodeCache.set(key, subtree);
    return subtree;
  };

  const shiftSubtree = (key, deltaX) => {
    if (!deltaX) {
      return;
    }
    const subtree = collectSubtreeNodes(key);
    for (const nodeKey of subtree) {
      if (positions[nodeKey]) {
        positions[nodeKey].x += deltaX;
      }
    }
  };

  const viewportWidth = elements.hierarchyViewport?.clientWidth || 0;
  const maxRowWidth = Math.max(CARD_WIDTH * 4, Math.round((viewportWidth || 1200) * 2.4));
  let rowX = CANVAS_MARGIN;
  let rowY = CANVAS_MARGIN;
  let rowUsedWidth = 0;
  let rowMaxDepth = 0;

  const placeRoot = (key) => {
    if (assigned.has(key)) {
      return;
    }

    const branchWidth = subtreeWidth(key);
    const branchDepth = subtreeDepth(key);
    const additionalWidth = rowUsedWidth === 0 ? branchWidth : ROOT_GAP + branchWidth;

    if (rowUsedWidth > 0 && rowUsedWidth + additionalWidth > maxRowWidth) {
      const rowHeight = CARD_HEIGHT + Math.max(0, rowMaxDepth - 1) * levelHeight;
      rowY += rowHeight + ROOT_ROW_GAP;
      rowX = CANVAS_MARGIN;
      rowUsedWidth = 0;
      rowMaxDepth = 0;
    }

    assignTree(key, rowX, 0, rowY);
    rowX += branchWidth + ROOT_GAP;
    rowUsedWidth += additionalWidth;
    rowMaxDepth = Math.max(rowMaxDepth, branchDepth);
  };

  for (const rootKey of effectiveRoots) {
    placeRoot(rootKey);
  }

  for (const key of allNodeKeys) {
    placeRoot(key);
  }

  const nodesByRowY = new Map();
  for (const key of allNodeKeys) {
    const position = positions[key];
    if (!position) {
      continue;
    }
    const rowKey = String(position.y);
    if (!nodesByRowY.has(rowKey)) {
      nodesByRowY.set(rowKey, []);
    }
    nodesByRowY.get(rowKey).push(key);
  }

  for (const rowNodes of nodesByRowY.values()) {
    rowNodes.sort((a, b) => {
      const delta = positions[a].x - positions[b].x;
      if (delta !== 0) {
        return delta;
      }
      return sortByLabel(a, b);
    });

    let previousRight = null;
    for (const key of rowNodes) {
      if (previousRight === null) {
        previousRight = positions[key].x + CARD_WIDTH;
        continue;
      }
      const minimumX = previousRight + CARD_GAP_X;
      if (positions[key].x < minimumX) {
        shiftSubtree(key, minimumX - positions[key].x);
      }
      previousRight = positions[key].x + CARD_WIDTH;
    }
  }

  let maxX = 0;
  let maxY = 0;
  for (const position of Object.values(positions)) {
    maxX = Math.max(maxX, position.x + CARD_WIDTH);
    maxY = Math.max(maxY, position.y + CARD_HEIGHT);
  }

  const canvasWidth = Math.max(maxX + CANVAS_MARGIN, CARD_WIDTH + CANVAS_MARGIN * 2);
  const canvasHeight = Math.max(maxY + CANVAS_MARGIN, CARD_HEIGHT + CANVAS_MARGIN * 2);

  const verticalEdges = (hierarchy?.verticalEdges || []).filter(
    (edge) => positions[edge.from] && positions[edge.to]
  );
  const horizontalEdges = (hierarchy?.horizontalEdges || []).filter(
    (edge) => positions[edge.from] && positions[edge.to]
  );

  return {
    positions,
    canvasWidth,
    canvasHeight,
    verticalEdges,
    horizontalEdges,
    nodeKeys: allNodeKeys,
  };
}

function renderHierarchyCardsSvg(layout) {
  const issueIndex = state.data?.issueIndex || {};
  return layout.nodeKeys
    .map((key) => {
      const issue = issueIndex[key] || {};
      const position = layout.positions[key];
      const x = Math.round(Number(position?.x));
      const y = Math.round(Number(position?.y));
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        return '';
      }

      const href = buildIssueHref(key);
      const summary = truncate(issue.summary || 'No summary', 36);
      const status = issue.status || 'No status';
      const priority = issue.priority || 'No priority';
      const fixedVersionsRaw = Array.isArray(issue.fixedVersions) ? issue.fixedVersions.join(', ') : '';
      const fixedVersions = truncate(fixedVersionsRaw || 'None', 34);
      const issueType = issue.issueType || 'Issue';
      const issueTypeColors = getIssueTypeColors(issueType);

      const badgeWidth = clamp(Math.round(key.length * 8 + 22), 64, CARD_WIDTH - 24);
      const availableTypeWidth = clamp(CARD_WIDTH - 20 - badgeWidth - 10, 54, CARD_WIDTH - 24);
      const issueTypeMaxChars = Math.max(6, Math.floor((availableTypeWidth - 18) / 7));
      const issueTypeLabel = truncate(issueType, issueTypeMaxChars);
      const issueTypeBadgeWidth = clamp(Math.round(issueTypeLabel.length * 7 + 18), 54, availableTypeWidth);
      const issueTypeX = x + CARD_WIDTH - 10 - issueTypeBadgeWidth;
      const titleText = escapeHtml(`${key} - ${issue.summary || ''}`);
      const canDrag = canDragFromChart(key);
      const cardClasses = ['tm-svg-card-link'];
      if (canDrag) {
        cardClasses.push('chart-draggable');
      }
      const cardClassAttr = cardClasses.join(' ');
      const cardAttrs = `class="${cardClassAttr}" data-issue-key="${escapeHtml(
        key
      )}" data-source-draggable="${canDrag ? 'true' : 'false'}" draggable="${canDrag ? 'true' : 'false'}"`;

      const cardBody = `
        <g class="tm-svg-card-group">
          <title>${titleText}</title>
          <rect class="tm-svg-card" x="${x}" y="${y}" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="10" ry="10" />
          <rect class="tm-svg-key-bg" x="${x + 10}" y="${y + 10}" width="${badgeWidth}" height="28" rx="6" ry="6" />
          <text class="tm-svg-key-text" x="${x + 18}" y="${y + 28}">${escapeHtml(key)}</text>
          <rect x="${issueTypeX}" y="${y + 10}" width="${issueTypeBadgeWidth}" height="28" rx="6" ry="6" fill="${issueTypeColors.bg}" stroke="${issueTypeColors.border}" stroke-width="1" />
          <text x="${issueTypeX + 9}" y="${y + 28}" fill="${issueTypeColors.text}" font-size="11" font-weight="700">${escapeHtml(issueTypeLabel)}</text>
          <text class="tm-svg-summary" x="${x + 10}" y="${y + 60}">${escapeHtml(summary)}</text>
          <text class="tm-svg-meta" x="${x + 10}" y="${y + 92}">Status: ${escapeHtml(status)}</text>
          <text class="tm-svg-meta" x="${x + 10}" y="${y + 114}">Priority: ${escapeHtml(priority)}</text>
          <text class="tm-svg-meta" x="${x + 10}" y="${y + 136}">Fix version: ${escapeHtml(fixedVersions)}</text>
        </g>
      `;

      if (href) {
        return `<a ${cardAttrs} href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${cardBody}</a>`;
      }
      return `<g ${cardAttrs}>${cardBody}</g>`;
    })
    .join('');
}

function renderHierarchyEdges(layout) {
  const verticalPaths = layout.verticalEdges
    .map((edge) => {
      const from = layout.positions[edge.from];
      const to = layout.positions[edge.to];
      const fromX = from.x + CARD_WIDTH / 2;
      const fromY = from.y + CARD_HEIGHT;
      const toX = to.x + CARD_WIDTH / 2;
      const toY = to.y;
      const midY = fromY + (toY - fromY) / 2;
      return `<path class="edge-parent" d="M ${fromX} ${fromY} L ${fromX} ${midY} L ${toX} ${midY} L ${toX} ${toY}" />`;
    })
    .join('');

  const horizontalPaths = state.showRelations
    ? layout.horizontalEdges
      .map((edge) => {
        const from = layout.positions[edge.from];
        const to = layout.positions[edge.to];
        const fromX = from.x + CARD_WIDTH / 2;
        const fromY = from.y + CARD_HEIGHT / 2;
        const toX = to.x + CARD_WIDTH / 2;
        const toY = to.y + CARD_HEIGHT / 2;
        const liftY = Math.min(fromY, toY) - 48;
        const delta = Math.max(60, Math.abs(toX - fromX) / 2);
        const c1x = fromX < toX ? fromX + delta : fromX - delta;
        const c2x = fromX < toX ? toX - delta : toX + delta;
        return `<path class="edge-related" d="M ${fromX} ${fromY} C ${c1x} ${liftY} ${c2x} ${liftY} ${toX} ${toY}" />`;
      })
      .join('')
    : '';

  const cards = renderHierarchyCardsSvg(layout);
  elements.hierarchyEdges.setAttribute('width', String(layout.canvasWidth));
  elements.hierarchyEdges.setAttribute('height', String(layout.canvasHeight));
  elements.hierarchyEdges.setAttribute('viewBox', `0 0 ${layout.canvasWidth} ${layout.canvasHeight}`);
  elements.hierarchyEdges.innerHTML = `${verticalPaths}${horizontalPaths}${cards}`;
}

function clearChartDropTargets() {
  const targets = elements.hierarchyEdges.querySelectorAll('.tm-svg-card-link.chart-drop-target');
  for (const target of targets) {
    target.classList.remove('chart-drop-target');
  }
  state.chartDropTargetKey = '';
}

function clearChartDragSource() {
  const source = elements.hierarchyEdges.querySelector('.tm-svg-card-link.chart-drag-source');
  if (source) {
    source.classList.remove('chart-drag-source');
  }
}

function hideDragGhost() {
  if (!elements.dragGhost) {
    return;
  }
  elements.dragGhost.classList.remove('visible');
  elements.dragGhost.classList.add('hidden');
  elements.dragGhost.style.transform = 'translate(-9999px, -9999px)';
  elements.dragGhost.innerHTML = '';
}

function stopChartAutoPanLoop() {
  if (!state.chartAutoPanRaf) {
    return;
  }
  cancelAnimationFrame(state.chartAutoPanRaf);
  state.chartAutoPanRaf = 0;
}

function clearChartDragState() {
  stopChartAutoPanLoop();
  state.chartDraggedIssueKey = '';
  state.chartDragPointerId = null;
  state.chartDragMoved = false;
  state.chartDragStartX = 0;
  state.chartDragStartY = 0;
  state.chartPointerX = 0;
  state.chartPointerY = 0;
  elements.hierarchyViewport.classList.remove('chart-assign-dragging');
  clearChartDropTargets();
  clearChartDragSource();
  hideDragGhost();
}

function updateDragGhostPosition(clientX, clientY) {
  if (!elements.dragGhost || elements.dragGhost.classList.contains('hidden')) {
    return;
  }
  const viewportRect = elements.hierarchyViewport.getBoundingClientRect();
  const offsetX = clientX - viewportRect.left + DRAG_GHOST_OFFSET_X;
  const offsetY = clientY - viewportRect.top + DRAG_GHOST_OFFSET_Y;
  elements.dragGhost.style.transform = `translate(${Math.round(offsetX)}px, ${Math.round(offsetY)}px)`;
}

function showDragGhost(issueKey, clientX, clientY) {
  if (!elements.dragGhost) {
    return;
  }

  const issue = state.data?.issueIndex?.[issueKey] || {};
  const issueType = issue.issueType || 'Issue';
  const typeColors = getIssueTypeColors(issueType);
  elements.dragGhost.innerHTML = `
    <div class="drag-ghost-key">${escapeHtml(issueKey)}</div>
    <span class="drag-ghost-type" style="--pill-bg:${typeColors.bg};--pill-border:${typeColors.border};--pill-text:${typeColors.text};">${escapeHtml(truncate(issueType, 16))}</span>
    <div class="drag-ghost-summary">${escapeHtml(truncate(issue.summary || 'No summary', 54))}</div>
  `;
  elements.dragGhost.classList.remove('hidden');
  elements.dragGhost.classList.add('visible');
  updateDragGhostPosition(clientX, clientY);
}

function findCardAtPoint(clientX, clientY) {
  const hit = document.elementFromPoint(clientX, clientY);
  if (!hit) {
    return null;
  }
  return hit.closest?.('.tm-svg-card-link') || null;
}

function updateChartDropTarget(clientX, clientY) {
  clearChartDropTargets();
  if (!state.chartDraggedIssueKey) {
    return;
  }

  const card = findCardAtPoint(clientX, clientY);
  if (!card) {
    return;
  }

  const targetKey = card.dataset.issueKey || '';
  if (!canAssignInChart(state.chartDraggedIssueKey, targetKey)) {
    return;
  }

  state.chartDropTargetKey = targetKey;
  card.classList.add('chart-drop-target');
}

function autoPanDuringDrag(clientX, clientY) {
  if (!state.layout) {
    return false;
  }

  const rect = elements.hierarchyViewport.getBoundingClientRect();
  let deltaX = 0;
  let deltaY = 0;

  if (clientX < rect.left + DRAG_AUTOPAN_EDGE) {
    const ratio = (rect.left + DRAG_AUTOPAN_EDGE - clientX) / DRAG_AUTOPAN_EDGE;
    deltaX = DRAG_AUTOPAN_MAX_STEP * clamp(ratio, 0, 1);
  } else if (clientX > rect.right - DRAG_AUTOPAN_EDGE) {
    const ratio = (clientX - (rect.right - DRAG_AUTOPAN_EDGE)) / DRAG_AUTOPAN_EDGE;
    deltaX = -DRAG_AUTOPAN_MAX_STEP * clamp(ratio, 0, 1);
  }

  if (clientY < rect.top + DRAG_AUTOPAN_EDGE) {
    const ratio = (rect.top + DRAG_AUTOPAN_EDGE - clientY) / DRAG_AUTOPAN_EDGE;
    deltaY = DRAG_AUTOPAN_MAX_STEP * clamp(ratio, 0, 1);
  } else if (clientY > rect.bottom - DRAG_AUTOPAN_EDGE) {
    const ratio = (clientY - (rect.bottom - DRAG_AUTOPAN_EDGE)) / DRAG_AUTOPAN_EDGE;
    deltaY = -DRAG_AUTOPAN_MAX_STEP * clamp(ratio, 0, 1);
  }

  if (!deltaX && !deltaY) {
    return false;
  }

  state.panX += deltaX;
  state.panY += deltaY;
  applyHierarchyCamera();
  return true;
}

function runChartAutoPanLoop() {
  if (!state.chartDraggedIssueKey || !state.chartDragMoved) {
    stopChartAutoPanLoop();
    return;
  }

  const didPan = autoPanDuringDrag(state.chartPointerX, state.chartPointerY);
  if (didPan) {
    updateDragGhostPosition(state.chartPointerX, state.chartPointerY);
    updateChartDropTarget(state.chartPointerX, state.chartPointerY);
    state.chartAutoPanRaf = requestAnimationFrame(runChartAutoPanLoop);
    return;
  }

  state.chartAutoPanRaf = 0;
}

function ensureChartAutoPanLoop() {
  if (state.chartAutoPanRaf) {
    return;
  }
  state.chartAutoPanRaf = requestAnimationFrame(runChartAutoPanLoop);
}

function renderLonelyIssues() {
  const lonelyKeys = state.data?.lonelyIssueKeys || [];
  const issueIndex = state.data?.issueIndex || {};
  if (lonelyKeys.length === 0) {
    elements.lonelySection.classList.add('hidden');
    elements.lonelyRows.innerHTML = '';
    return;
  }

  elements.lonelySection.classList.remove('hidden');
  elements.lonelyRows.innerHTML = lonelyKeys
    .map((key) => {
      const issue = issueIndex[key] || {};
      const href = buildIssueHref(key);
      const issueCell = href
        ? `<a class="row-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(key)}</a>`
        : escapeHtml(key);
      return `
        <tr>
          <td>${issueCell}</td>
          <td>${escapeHtml(truncate(issue.summary || 'No summary', 120))}</td>
          <td>${escapeHtml(issue.status || 'No status')}</td>
          <td>${escapeHtml(issue.priority || 'No priority')}</td>
          <td>${escapeHtml(issue.issueType || 'Issue')}</td>
        </tr>
      `;
    })
    .join('');
}

function isEpicIssueType(typeName) {
  return /epic/i.test(typeName || '');
}

function isSubtaskIssueType(typeName) {
  const lookup = String(typeName || '').trim().toLowerCase();
  const issueType = state.issueTypes.find(
    (item) => String(item.name || '').trim().toLowerCase() === lookup
  );
  if (issueType) {
    return Boolean(issueType.subtask);
  }
  return /sub[- ]?task/i.test(typeName || '');
}

function getNodeMetaMap() {
  return state.data?.hierarchy?.nodeMeta || {};
}

function getNodeMeta(issueKey) {
  return getNodeMetaMap()[issueKey] || {};
}

function canDragFromChart(issueKey) {
  if (!issueKey) {
    return false;
  }
  const issue = state.data?.issueIndex?.[issueKey];
  if (!issue) {
    return false;
  }
  if (isEpicIssueType(issue.issueType)) {
    return false;
  }

  const node = getNodeMeta(issueKey);
  const childCount = Array.isArray(node.childKeys) ? node.childKeys.length : 0;
  return childCount === 0;
}

function canBeChartParentForSource(sourceKey, targetKey) {
  if (!sourceKey || !targetKey || sourceKey === targetKey) {
    return false;
  }
  const sourceIssue = state.data?.issueIndex?.[sourceKey];
  const targetIssue = state.data?.issueIndex?.[targetKey];
  if (!sourceIssue || !targetIssue) {
    return false;
  }

  const sourceType = sourceIssue.issueType;
  const targetType = targetIssue.issueType;

  if (isSubtaskIssueType(sourceType)) {
    return !isSubtaskIssueType(targetType);
  }
  return isEpicIssueType(targetType);
}

function canAssignInChart(sourceKey, targetKey) {
  if (!sourceKey || !targetKey || sourceKey === targetKey) {
    return false;
  }
  if (!canDragFromChart(sourceKey) || !canBeChartParentForSource(sourceKey, targetKey)) {
    return false;
  }

  const nodeMeta = getNodeMetaMap();
  const visited = new Set();
  let current = targetKey;
  while (current && !visited.has(current)) {
    if (current === sourceKey) {
      return false;
    }
    visited.add(current);
    current = nodeMeta[current]?.parentKey || null;
  }

  return true;
}

function clampHierarchyPan() {
  if (!state.layout) {
    return;
  }
  const viewport = elements.hierarchyViewport;
  const scaledWidth = state.layout.canvasWidth * state.zoom;
  const scaledHeight = state.layout.canvasHeight * state.zoom;
  const minX = Math.min(PAN_PADDING, viewport.clientWidth - scaledWidth - PAN_PADDING);
  const minY = Math.min(PAN_PADDING, viewport.clientHeight - scaledHeight - PAN_PADDING);
  state.panX = clamp(state.panX, minX, PAN_PADDING);
  state.panY = clamp(state.panY, minY, PAN_PADDING);
}

function applyHierarchyCamera() {
  if (!state.layout) {
    return;
  }
  clampHierarchyPan();
  elements.hierarchyStage.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  elements.zoomLabel.textContent = `${Math.round(state.zoom * 100)}%`;
}

function fitHierarchyToViewport(preferReadableScale) {
  if (!state.layout) {
    return;
  }
  const viewport = elements.hierarchyViewport;
  if (!viewport.clientWidth || !viewport.clientHeight) {
    return;
  }

  const fitX = viewport.clientWidth / state.layout.canvasWidth;
  const fitY = viewport.clientHeight / state.layout.canvasHeight;
  const fitZoom = clamp(Math.min(fitX, fitY, 1), ZOOM_MIN, ZOOM_MAX);
  state.zoom = preferReadableScale
    ? clamp(Math.max(fitZoom, INITIAL_READABLE_ZOOM), ZOOM_MIN, ZOOM_MAX)
    : fitZoom;
  state.panX = (viewport.clientWidth - state.layout.canvasWidth * state.zoom) / 2;
  state.panY = Math.max(PAN_PADDING, (viewport.clientHeight - state.layout.canvasHeight * state.zoom) / 2);
  applyHierarchyCamera();
}

function renderHierarchyView(preserveCamera = false) {
  const previousCamera = preserveCamera && state.layout
    ? { zoom: state.zoom, panX: state.panX, panY: state.panY }
    : null;

  const hierarchy = state.data?.hierarchy;
  state.layout = computeHierarchyLayout(hierarchy);
  if (!state.layout) {
    elements.hierarchyStage.classList.add('hidden');
    elements.hierarchyEmptyState.classList.remove('hidden');
    elements.hierarchyEmptyState.textContent = 'No hierarchy found for the selected filters.';
    renderLonelyIssues();
    return;
  }

  elements.hierarchyEmptyState.classList.add('hidden');
  elements.hierarchyStage.classList.remove('hidden');
  elements.hierarchyStage.style.width = `${state.layout.canvasWidth}px`;
  elements.hierarchyStage.style.height = `${state.layout.canvasHeight}px`;
  renderHierarchyEdges(state.layout);
  renderLonelyIssues();

  if (previousCamera) {
    state.zoom = clamp(previousCamera.zoom, ZOOM_MIN, ZOOM_MAX);
    state.panX = previousCamera.panX;
    state.panY = previousCamera.panY;
    applyHierarchyCamera();
  } else {
    fitHierarchyToViewport(true);
  }
}

async function assignIssueParentInHierarchy(issueKey, parentKey) {
  if (!issueKey || !parentKey || issueKey === parentKey) {
    return;
  }

  try {
    setStatus('loading', `Assigning ${issueKey} -> ${parentKey}...`);
    await invoke('assignIssueParent', { issueKey, parentKey });
    await loadMatrix({ persist: false, preserveHierarchyCamera: true });
    showSuccessMessage(`Assigned ${issueKey} -> ${parentKey}.`);
  } catch (error) {
    setStatus('error', error?.message || 'Failed to assign parent issue.');
  }
}

function onHierarchyWheel(event) {
  if (state.mode !== MODES.HIERARCHICAL || !state.layout) {
    return;
  }
  event.preventDefault();

  const rect = elements.hierarchyViewport.getBoundingClientRect();
  const px = event.clientX - rect.left;
  const py = event.clientY - rect.top;

  if (event.shiftKey) {
    state.panX -= event.deltaX;
    state.panY -= event.deltaY;
    applyHierarchyCamera();
    return;
  }

  const zoomFactor = Math.exp(-event.deltaY * 0.0015);
  const nextZoom = clamp(state.zoom * zoomFactor, ZOOM_MIN, ZOOM_MAX);
  const worldX = (px - state.panX) / state.zoom;
  const worldY = (py - state.panY) / state.zoom;
  state.zoom = nextZoom;
  state.panX = px - worldX * state.zoom;
  state.panY = py - worldY * state.zoom;
  applyHierarchyCamera();
}

function onHierarchyPointerDown(event) {
  if (state.mode !== MODES.HIERARCHICAL) {
    return;
  }
  if (event.button !== 0 && event.button !== 1) {
    return;
  }
  const card = event.target.closest('.tm-svg-card-link');
  if (card && event.button === 0) {
    const issueKey = card.dataset.issueKey || '';
    if (canDragFromChart(issueKey)) {
      state.chartDraggedIssueKey = issueKey;
      state.chartDragPointerId = event.pointerId;
      state.chartDragStartX = event.clientX;
      state.chartDragStartY = event.clientY;
      state.chartPointerX = event.clientX;
      state.chartPointerY = event.clientY;
      state.chartDragMoved = false;
      clearChartDragSource();
      clearChartDropTargets();
      card.classList.add('chart-drag-source');
      elements.hierarchyViewport.classList.add('chart-assign-dragging');
      showDragGhost(issueKey, event.clientX, event.clientY);
      elements.hierarchyViewport.setPointerCapture(event.pointerId);
      event.preventDefault();
    }
    return;
  }

  state.isDragging = true;
  state.dragStartX = event.clientX;
  state.dragStartY = event.clientY;
  state.dragStartPanX = state.panX;
  state.dragStartPanY = state.panY;
  elements.hierarchyViewport.classList.add('dragging');
  elements.hierarchyViewport.setPointerCapture(event.pointerId);
}

function onHierarchyPointerMove(event) {
  if (state.chartDraggedIssueKey && state.chartDragPointerId === event.pointerId) {
    state.chartPointerX = event.clientX;
    state.chartPointerY = event.clientY;
    updateDragGhostPosition(event.clientX, event.clientY);
    const movedDistance =
      Math.abs(event.clientX - state.chartDragStartX) + Math.abs(event.clientY - state.chartDragStartY);
    if (movedDistance > 4) {
      state.chartDragMoved = true;
    }
    if (state.chartDragMoved) {
      const didPan = autoPanDuringDrag(event.clientX, event.clientY);
      if (didPan) {
        ensureChartAutoPanLoop();
      } else {
        stopChartAutoPanLoop();
      }
      updateChartDropTarget(event.clientX, event.clientY);
    }
    return;
  }

  if (!state.isDragging || state.mode !== MODES.HIERARCHICAL) {
    return;
  }
  state.panX = state.dragStartPanX + (event.clientX - state.dragStartX);
  state.panY = state.dragStartPanY + (event.clientY - state.dragStartY);
  applyHierarchyCamera();
}

function onHierarchyPointerUp(event) {
  if (state.chartDraggedIssueKey && state.chartDragPointerId === event.pointerId) {
    const draggedKey = state.chartDraggedIssueKey;
    const dropTargetKey = state.chartDropTargetKey || '';
    const moved = state.chartDragMoved;
    const shouldAssign = moved && canAssignInChart(draggedKey, dropTargetKey);
    const pointerId = state.chartDragPointerId;

    if (elements.hierarchyViewport.hasPointerCapture(pointerId)) {
      elements.hierarchyViewport.releasePointerCapture(pointerId);
    }
    clearChartDragState();

    if (moved) {
      state.suppressCardClickUntil = Date.now() + 350;
    }
    if (shouldAssign) {
      void assignIssueParentInHierarchy(draggedKey, dropTargetKey);
    }
    return;
  }

  if (!state.isDragging) {
    return;
  }
  state.isDragging = false;
  elements.hierarchyViewport.classList.remove('dragging');
  if (elements.hierarchyViewport.hasPointerCapture(event.pointerId)) {
    elements.hierarchyViewport.releasePointerCapture(event.pointerId);
  }
}

function onHierarchyCardClick(event) {
  if (Date.now() <= state.suppressCardClickUntil) {
    event.preventDefault();
    event.stopPropagation();
  }
}

function updateFullscreenButton() {
  if (!elements.fullscreenButton) {
    return;
  }
  elements.fullscreenButton.textContent = document.fullscreenElement
    ? 'Exit full screen'
    : 'Full screen';
}

async function toggleFullscreen() {
  if (!elements.hierarchyViewport) {
    return;
  }
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await elements.hierarchyViewport.requestFullscreen();
    }
  } catch (error) {
    setStatus('error', 'Unable to switch full screen mode in this browser.');
  } finally {
    updateFullscreenButton();
    if (state.mode === MODES.HIERARCHICAL) {
      fitHierarchyToViewport(true);
    }
  }
}

function openCellModal(details) {
  if (!details) {
    return;
  }

  const { row, column, cell } = details;
  const rowIssue = state.data?.issueIndex?.[row.key] || { key: row.key };
  const columnIssue = state.data?.issueIndex?.[column.key] || { key: column.key };

  elements.modalTitle.textContent = `${rowIssue.key} × ${columnIssue.key || column.label}`;

  const sections = [];
  if (state.mode === MODES.COMPONENTS) {
    sections.push(`
      <section class="modal-section">
        <div class="modal-section-title">Relationship</div>
        <div>${escapeHtml(rowIssue.key)} | ${escapeHtml(rowIssue.summary || '')}</div>
        <div>Component: ${escapeHtml(column.label || column.key)}</div>
      </section>
    `);
  } else {
    const relations = Array.isArray(cell.relations) ? cell.relations : [];
    sections.push(`
      <section class="modal-section">
        <div class="modal-section-title">Story Pair</div>
        <div>${escapeHtml(rowIssue.key)} (${escapeHtml(rowIssue.status || 'Unknown')})</div>
        <div>${escapeHtml(columnIssue.key)} (${escapeHtml(columnIssue.status || 'Unknown')})</div>
      </section>
    `);

    if (relations.length > 0) {
      sections.push(`
        <section class="modal-section">
          <div class="modal-section-title">Relations</div>
          <ol class="modal-list">
            ${relations
              .map((relation) => {
                const direction = relation.direction || 'related to';
                const typeName = relation.typeName ? ` [${relation.typeName}]` : '';
                return `<li>${escapeHtml(direction + typeName)}</li>`;
              })
              .join('')}
          </ol>
        </section>
      `);
    }
  }

  const issueKeys = Array.isArray(cell.issueKeys) ? cell.issueKeys : [];
  if (issueKeys.length > 0) {
    sections.push(`
      <section class="modal-section">
        <div class="modal-section-title">Issues</div>
        <ul class="modal-list">
          ${issueKeys
            .map((issueKey) => {
              const issue = state.data?.issueIndex?.[issueKey];
              const label = issue?.summary ? `${issueKey} — ${issue.summary}` : issueKey;
              const href = state.siteUrl ? `${state.siteUrl}/browse/${issueKey}` : '';
              if (!href) {
                return `<li>${escapeHtml(label)}</li>`;
              }
              return `<li><a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(label)}</a></li>`;
            })
            .join('')}
        </ul>
      </section>
    `);
  }

  elements.modalBody.innerHTML = sections.join('');
  elements.modal.classList.remove('hidden');
}

function closeModal() {
  elements.modal.classList.add('hidden');
  elements.modalBody.innerHTML = '';
}

function renderAll(options = {}) {
  const preserveHierarchyCamera = Boolean(options.preserveHierarchyCamera);
  elements.projectLabel.textContent = state.projectKey ? `Project: ${state.projectKey}` : '';
  renderModeButtons();
  renderLegend();
  renderStats();
  syncContentViewportHeight();

  if (state.mode === MODES.HIERARCHICAL) {
    closeModal();
    elements.matrixWrap.classList.add('hidden');
    elements.hierarchyPanel.classList.remove('hidden');
    renderHierarchyView(preserveHierarchyCamera);
  } else {
    elements.hierarchyPanel.classList.add('hidden');
    elements.matrixWrap.classList.remove('hidden');
    renderMatrixTable();
  }
}

function syncContentViewportHeight() {
  if (!elements.matrixWrap || !elements.hierarchyPanel) {
    return;
  }

  const anchorRect = state.mode === MODES.HIERARCHICAL
    ? elements.hierarchyPanel.getBoundingClientRect()
    : elements.matrixWrap.getBoundingClientRect();
  const viewportBottomPadding = 14;
  const availableHeight = window.innerHeight - anchorRect.top - viewportBottomPadding;
  const nextHeight = Math.max(260, Math.floor(availableHeight));
  elements.matrixWrap.style.height = `${nextHeight}px`;
  elements.hierarchyPanel.style.height = `${nextHeight}px`;
  if (elements.hierarchyViewport) {
    const controlsHeight = elements.hierarchyPanel.querySelector('.hierarchy-controls')?.offsetHeight || 0;
    const viewportHeight = Math.max(360, nextHeight - controlsHeight - 20);
    elements.hierarchyViewport.style.height = `${viewportHeight}px`;
  }
}

async function persistState() {
  try {
    await invoke('setEnhancedMatrixState', {
      projectKey: state.projectKey,
      state: {
        mode: state.mode,
        issueTypes: state.selectedIssueTypes,
        epicKeys: state.selectedEpicKeys,
        fixedVersions: state.selectedFixedVersions,
        labels: state.selectedLabels,
        components: state.selectedComponents,
        jql: state.jql,
        relatedOnly: state.relatedOnly,
        showRelations: state.showRelations,
      },
    });
  } catch (error) {
    // Ignore persistence failures to keep UI responsive.
  }
}

async function loadMatrix({ persist = true, preserveHierarchyCamera = false } = {}) {
  syncControlsToState();
  clearChartDragState();
  if (persist) {
    await persistState();
  }

  state.loading = true;
  state.error = '';
  setStatus('loading', 'Loading matrix data...');
  elements.refreshButton.disabled = true;

  try {
    const result = await invoke('getMatrixData', {
      projectKey: state.projectKey,
      mode: state.mode,
      issueTypes: state.selectedIssueTypes,
      epicKeys: state.selectedEpicKeys,
      fixedVersions: state.selectedFixedVersions,
      labels: state.selectedLabels,
      components: state.selectedComponents,
      jql: state.jql,
    });
    state.data = result;
    setStatus('', '');
  } catch (error) {
    state.data = null;
    state.error = error?.message || 'Failed to load matrix data.';
    setStatus('error', state.error);
  } finally {
    state.loading = false;
    elements.refreshButton.disabled = false;
    renderAll({ preserveHierarchyCamera });
  }
}

async function loadFilters() {
  const [issueTypes, epics, fixedVersions, labels, components] = await Promise.all([
    invoke('getIssueTypes'),
    invoke('getEpics', { projectKey: state.projectKey }),
    invoke('getFixedVersions', { projectKey: state.projectKey }),
    invoke('getProjectLabels', { projectKey: state.projectKey }),
    invoke('getProjectComponents', { projectKey: state.projectKey }),
  ]);

  state.issueTypes = (issueTypes || []).slice().sort((a, b) => sortByLabel(a.name, b.name));
  state.epics = (epics || []).slice().sort((a, b) => sortByLabel(a.key, b.key));
  state.fixedVersions = (fixedVersions || []).slice().sort((a, b) => sortByLabel(a.name, b.name));
  state.labels = (labels || []).slice().sort(sortByLabel);
  state.components = (components || []).slice().sort(sortByLabel);
}

async function loadSavedState() {
  try {
    let saved = null;
    if (state.projectKey) {
      saved = await invoke('getEnhancedMatrixState', { projectKey: state.projectKey });
    }
    if (!saved) {
      saved = await invoke('getEnhancedMatrixLastState');
    }
    if (!saved || typeof saved !== 'object') {
      return;
    }

    if (!state.projectKey && typeof saved.projectKey === 'string') {
      state.projectKey = saved.projectKey;
    }
    if (isModeSupported(saved.mode)) {
      state.mode = normalizeMode(saved.mode);
    }
    state.selectedIssueTypes = Array.isArray(saved.issueTypes) ? saved.issueTypes : [];
    state.selectedEpicKeys = Array.isArray(saved.epicKeys) ? saved.epicKeys : [];
    state.selectedFixedVersions = Array.isArray(saved.fixedVersions) ? saved.fixedVersions : [];
    state.selectedLabels = Array.isArray(saved.labels) ? saved.labels : [];
    state.selectedComponents = Array.isArray(saved.components) ? saved.components : [];
    state.jql = typeof saved.jql === 'string' ? saved.jql : '';
    state.relatedOnly = Boolean(saved.relatedOnly);
    state.showRelations = Boolean(saved.showRelations);
  } catch (error) {
    // Ignore saved state errors and use defaults.
  }
}

function bindEvents() {
  enableToggleMultiSelect(elements.issueTypeSelect);
  enableToggleMultiSelect(elements.epicSelect);
  enableToggleMultiSelect(elements.fixedVersionSelect);
  enableToggleMultiSelect(elements.labelSelect);
  enableToggleMultiSelect(elements.componentSelect);

  elements.modeComponentsButton.addEventListener('click', async () => {
    if (state.mode === MODES.COMPONENTS) {
      return;
    }
    state.mode = MODES.COMPONENTS;
    state.relatedOnly = false;
    clearChartDragState();
    syncStateToControls();
    await loadMatrix();
  });

  elements.modeStoryButton.addEventListener('click', async () => {
    if (state.mode === MODES.STORY_TO_STORY) {
      return;
    }
    state.mode = MODES.STORY_TO_STORY;
    clearChartDragState();
    syncStateToControls();
    await loadMatrix();
  });

  elements.modeHierarchyButton.addEventListener('click', async () => {
    if (state.mode === MODES.HIERARCHICAL) {
      return;
    }
    state.mode = MODES.HIERARCHICAL;
    state.relatedOnly = false;
    syncStateToControls();
    await loadMatrix();
  });

  elements.issueTypeSelect.addEventListener('change', syncControlsToState);
  elements.epicSelect.addEventListener('change', syncControlsToState);
  elements.fixedVersionSelect.addEventListener('change', syncControlsToState);
  elements.labelSelect.addEventListener('change', syncControlsToState);
  elements.componentSelect.addEventListener('change', syncControlsToState);
  elements.jqlInput.addEventListener('input', syncControlsToState);
  elements.relatedOnlyCheckbox.addEventListener('change', syncControlsToState);

  elements.refreshButton.addEventListener('click', () => {
    void loadMatrix({ preserveHierarchyCamera: state.mode === MODES.HIERARCHICAL });
  });

  elements.resetFiltersButton.addEventListener('click', () => {
    resetFilters();
    void loadMatrix();
  });

  elements.zoomInButton.addEventListener('click', () => {
    if (state.mode !== MODES.HIERARCHICAL) {
      return;
    }
    state.zoom = clamp(state.zoom * 1.2, ZOOM_MIN, ZOOM_MAX);
    applyHierarchyCamera();
  });

  elements.zoomOutButton.addEventListener('click', () => {
    if (state.mode !== MODES.HIERARCHICAL) {
      return;
    }
    state.zoom = clamp(state.zoom / 1.2, ZOOM_MIN, ZOOM_MAX);
    applyHierarchyCamera();
  });

  elements.resetViewButton.addEventListener('click', () => {
    if (state.mode !== MODES.HIERARCHICAL) {
      return;
    }
    state.zoom = 1;
    state.panX = PAN_PADDING;
    state.panY = PAN_PADDING;
    applyHierarchyCamera();
  });

  elements.fitViewButton.addEventListener('click', () => {
    if (state.mode !== MODES.HIERARCHICAL) {
      return;
    }
    fitHierarchyToViewport(false);
  });

  elements.showRelationsCheckbox.addEventListener('change', () => {
    state.showRelations = Boolean(elements.showRelationsCheckbox.checked);
    if (state.mode === MODES.HIERARCHICAL && state.layout) {
      renderHierarchyEdges(state.layout);
      void persistState();
    }
  });

  elements.fullscreenButton.addEventListener('click', () => {
    if (state.mode !== MODES.HIERARCHICAL) {
      return;
    }
    void toggleFullscreen();
  });

  elements.hierarchyViewport.addEventListener('wheel', onHierarchyWheel, { passive: false });
  elements.hierarchyViewport.addEventListener('pointerdown', onHierarchyPointerDown);
  elements.hierarchyViewport.addEventListener('pointermove', onHierarchyPointerMove);
  elements.hierarchyViewport.addEventListener('pointerup', onHierarchyPointerUp);
  elements.hierarchyViewport.addEventListener('pointercancel', onHierarchyPointerUp);
  elements.hierarchyEdges.addEventListener('click', onHierarchyCardClick, true);
  elements.hierarchyEdges.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  elements.matrixTable.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-row-key][data-column-key]');
    if (!button) {
      return;
    }
    const rowKey = button.dataset.rowKey;
    const columnKey = button.dataset.columnKey;
    if (!rowKey || !columnKey) {
      return;
    }
    const details = state.cellLookup.get(`${rowKey}::${columnKey}`);
    openCellModal(details);
  });

  elements.modalCloseButton.addEventListener('click', closeModal);
  elements.modal.addEventListener('click', (event) => {
    const closeTarget = event.target.closest('[data-close-modal="true"]');
    if (closeTarget) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }
    if (!elements.modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  elements.filtersPanel.addEventListener('toggle', () => {
    window.requestAnimationFrame(syncContentViewportHeight);
  });

  window.addEventListener('resize', () => {
    syncContentViewportHeight();
    if (state.mode === MODES.HIERARCHICAL) {
      fitHierarchyToViewport(true);
    }
  });

  document.addEventListener('fullscreenchange', () => {
    updateFullscreenButton();
    if (state.mode === MODES.HIERARCHICAL) {
      fitHierarchyToViewport(true);
    }
  });
}

async function init() {
  try {
    state.context = await view.getContext();
    state.siteUrl = state.context.siteUrl || '';
    state.projectKey =
      state.context.extension?.project?.key ||
      state.context.project?.key ||
      '';

    await loadSavedState();
    if (!state.projectKey) {
      throw new Error('Project context is missing. Open Enhanced mode from a project matrix page.');
    }
    await loadFilters();
    state.mode = normalizeMode(state.mode);

    syncStateToControls();
    bindEvents();
    await loadMatrix({ persist: false });
  } catch (error) {
    setStatus('error', error?.message || 'Failed to initialize Enhanced Matrix view.');
  }
}

void init();
