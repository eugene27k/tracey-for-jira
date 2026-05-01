import { invoke, view } from '@forge/bridge';
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
  showRelations: false,
  jql: '',
  data: null,
  loading: false,
  error: '',
  info: '',
  success: '',
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
  zoom: 1,
  panX: 0,
  panY: 0,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  dragStartPanX: 0,
  dragStartPanY: 0,
  viewportRect: null,
  layout: null,
};
let successToastTimer = null;

const elements = {
  status: document.getElementById('status'),
  refreshButton: document.getElementById('refresh-btn'),
  refreshQuickButton: document.getElementById('refresh-quick-btn'),
  resetFiltersButton: document.getElementById('reset-filters-btn'),
  issueTypeSelect: document.getElementById('issue-type-select'),
  epicSelect: document.getElementById('epic-select'),
  fixedVersionSelect: document.getElementById('fixed-version-select'),
  labelSelect: document.getElementById('label-select'),
  componentSelect: document.getElementById('component-select'),
  jqlInput: document.getElementById('jql-input'),
  filtersPanel: document.getElementById('filters-panel'),
  filtersSummaryText: document.getElementById('filters-summary-text'),
  showRelationsCheckbox: document.getElementById('show-relations-checkbox'),
  zoomLabel: document.getElementById('zoom-label'),
  zoomInButton: document.getElementById('zoom-in-btn'),
  zoomOutButton: document.getElementById('zoom-out-btn'),
  resetViewButton: document.getElementById('reset-view-btn'),
  fitViewButton: document.getElementById('fit-view-btn'),
  fullscreenButton: document.getElementById('fullscreen-btn'),
  viewport: document.getElementById('hierarchy-viewport'),
  stage: document.getElementById('hierarchy-stage'),
  edgesSvg: document.getElementById('hierarchy-edges'),
  cardsLayer: document.getElementById('hierarchy-cards'),
  emptyState: document.getElementById('empty-state'),
  stats: document.getElementById('matrix-stats'),
  lonelySection: document.getElementById('lonely-section'),
  lonelyRows: document.getElementById('lonely-rows'),
  dragGhost: document.getElementById('chart-drag-ghost'),
  coverageWidget: document.getElementById('coverage-widget'),
  coverageBar: document.getElementById('coverage-bar'),
  coverageBarFill: document.getElementById('coverage-bar-fill'),
  coveragePercent: document.getElementById('coverage-percent'),
  coverageDetails: document.getElementById('coverage-details'),
  coverageBreakdown: document.getElementById('coverage-breakdown'),
};

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncate(value, maxLength) {
  const text = String(value || '');
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
}

function sortKeys(a, b) {
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
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

function computeHierarchyLayout(hierarchy) {
  const nodeMeta = hierarchy?.nodeMeta || {};
  const fallbackKeys = (hierarchy?.levels || []).flatMap((level) => level.issueKeys || []);
  const allNodeKeys = (Object.keys(nodeMeta).length > 0 ? Object.keys(nodeMeta) : fallbackKeys)
    .filter(Boolean)
    .sort(sortKeys);

  if (allNodeKeys.length === 0) {
    return null;
  }

  const nodeSet = new Set(allNodeKeys);
  const childMap = {};
  const parentMap = {};

  for (const key of allNodeKeys) {
    const children = Array.isArray(nodeMeta[key]?.childKeys) ? nodeMeta[key].childKeys : [];
    childMap[key] = children.filter((childKey) => nodeSet.has(childKey)).sort(sortKeys);
    const parentKey = nodeMeta[key]?.parentKey;
    parentMap[key] = parentKey && nodeSet.has(parentKey) ? parentKey : null;
  }

  const rootKeys = allNodeKeys.filter((key) => !parentMap[key]).sort(sortKeys);
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
  const levelsByKey = {};
  const assigned = new Set();
  const subtreeNodeCache = new Map();
  const subtreeNodeStack = new Set();

  const assignTree = (key, startX, depth, baseY, recursionStack = new Set()) => {
    if (assigned.has(key)) {
      return;
    }
    if (recursionStack.has(key)) {
      positions[key] = { x: startX, y: baseY + depth * levelHeight };
      levelsByKey[key] = depth;
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
      levelsByKey[key] = depth;
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
    levelsByKey[key] = depth;
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

  const viewportWidth = elements.viewport?.clientWidth || 0;
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
      return sortKeys(a, b);
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
    levelsByKey,
    canvasWidth,
    canvasHeight,
    verticalEdges,
    horizontalEdges,
    nodeKeys: allNodeKeys,
  };
}

function renderStatus() {
  elements.status.innerHTML = '';
  if (state.error) {
    elements.status.innerHTML = `<div class="status error">${escapeHtml(state.error)}</div>`;
    return;
  }
  if (state.info) {
    elements.status.innerHTML = `
      <div class="status loading with-spinner">
        <span class="status-spinner" aria-hidden="true"></span>
        <span>${escapeHtml(state.info)}</span>
      </div>
    `;
    return;
  }
  if (state.loading) {
    elements.status.innerHTML = `
      <div class="status loading with-spinner">
        <span class="status-spinner" aria-hidden="true"></span>
        <span>Loading hierarchy...</span>
      </div>
    `;
    return;
  }
  if (state.success) {
    elements.status.innerHTML = `<div class="status success">${escapeHtml(state.success)}</div>`;
  }
}

function showSuccessMessage(message, timeoutMs = 2000) {
  if (successToastTimer) {
    clearTimeout(successToastTimer);
    successToastTimer = null;
  }
  state.success = message;
  renderStatus();
  successToastTimer = setTimeout(() => {
    state.success = '';
    renderStatus();
    successToastTimer = null;
  }, timeoutMs);
}

function renderStats() {
  const issueCount = state.data?.issueCount || 0;
  const total = state.data?.totalIssues || 0;
  const trunc = state.data?.truncated ? ' • capped at 2,000 issues' : '';
  elements.stats.textContent = `Project ${state.projectKey} • ${issueCount}/${total} issues${trunc}`;
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

  if (!state.data) {
    elements.coverageWidget.classList.add('hidden');
    return;
  }

  const coverage = computeCoverage();
  elements.coverageWidget.classList.remove('hidden');

  const percent = clamp(coverage.percent, 0, 100);
  if (elements.coverageBarFill) {
    elements.coverageBarFill.style.width = `${percent}%`;
  }
  if (elements.coverageBar) {
    elements.coverageBar.setAttribute(
      'aria-valuemin',
      '0'
    );
    elements.coverageBar.setAttribute(
      'aria-valuemax',
      '100'
    );
    elements.coverageBar.setAttribute(
      'aria-valuenow',
      String(percent)
    );
    elements.coverageBar.setAttribute(
      'aria-label',
      `Parent coverage ${percent} percent (${coverage.assigned} assigned, ${coverage.unassigned} unassigned)`
    );
  }
  elements.coveragePercent.textContent = `${percent}%`;
  elements.coverageDetails.textContent = `Assigned ${coverage.assigned} of ${coverage.total} non-epic issues`;
  elements.coverageBreakdown.textContent = `${coverage.assigned} assigned • ${coverage.unassigned} unassigned`;
}

function renderFilterSummary() {
  if (!elements.filtersSummaryText) {
    return;
  }

  const parts = [];
  if (state.selectedIssueTypes.length > 0) {
    parts.push(`${state.selectedIssueTypes.length} issue type${state.selectedIssueTypes.length === 1 ? '' : 's'}`);
  }
  if (state.selectedEpicKeys.length > 0) {
    parts.push(`${state.selectedEpicKeys.length} epic${state.selectedEpicKeys.length === 1 ? '' : 's'}`);
  }
  if (state.selectedFixedVersions.length > 0) {
    parts.push(`${state.selectedFixedVersions.length} version${state.selectedFixedVersions.length === 1 ? '' : 's'}`);
  }
  if (state.selectedLabels.length > 0) {
    parts.push(`${state.selectedLabels.length} label${state.selectedLabels.length === 1 ? '' : 's'}`);
  }
  if (state.selectedComponents.length > 0) {
    parts.push(`${state.selectedComponents.length} component${state.selectedComponents.length === 1 ? '' : 's'}`);
  }
  if (String(state.jql || '').trim()) {
    parts.push('JQL');
  }

  elements.filtersSummaryText.textContent = parts.length > 0 ? parts.join(' • ') : 'No filters';
}

function resetAllFilters() {
  state.selectedIssueTypes = [];
  state.selectedEpicKeys = [];
  state.selectedFixedVersions = [];
  state.selectedLabels = [];
  state.selectedComponents = [];
  state.jql = '';
  syncStateToControls();
}

function buildIssueHref(issueKey) {
  if (!state.siteUrl) {
    return '';
  }
  return `${state.siteUrl}/browse/${issueKey}`;
}

function renderCardsSvg(layout) {
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
      const titleText = escapeHtml(`${key} - ${issue.summary || ''}`);
      const badgeWidth = clamp(Math.round(key.length * 8 + 22), 64, CARD_WIDTH - 24);
      const availableTypeWidth = clamp(CARD_WIDTH - 20 - badgeWidth - 10, 54, CARD_WIDTH - 24);
      const issueTypeMaxChars = Math.max(6, Math.floor((availableTypeWidth - 18) / 7));
      const issueTypeLabel = truncate(issueType, issueTypeMaxChars);
      const issueTypeBadgeWidth = clamp(
        Math.round(issueTypeLabel.length * 7 + 18),
        54,
        availableTypeWidth
      );
      const issueTypeX = x + CARD_WIDTH - 10 - issueTypeBadgeWidth;
      const canDrag = canDragFromChart(key);
      const canDrop = canEverBeChartParent(key);
      const cardClasses = ['tm-svg-card-link'];
      if (canDrag) {
        cardClasses.push('chart-draggable');
      }
      if (canDrop) {
        cardClasses.push('chart-parent-target');
      }
      const cardClassAttr = cardClasses.join(' ');
      const cardAttrs = `class="${cardClassAttr}" data-issue-key="${escapeHtml(
        key
      )}" data-source-draggable="${canDrag ? 'true' : 'false'}" data-parent-target="${
        canDrop ? 'true' : 'false'
      }" draggable="${canDrag ? 'true' : 'false'}"`;
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

function renderEdges(layout) {
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
      const typeLabel = escapeHtml((edge.types || []).join(', '));
      return `
        <path class="edge-related" d="M ${fromX} ${fromY} C ${c1x} ${liftY} ${c2x} ${liftY} ${toX} ${toY}" />
        <title>${escapeHtml(edge.from)} <-> ${escapeHtml(edge.to)} [${typeLabel}]</title>
      `;
    })
    .join('')
    : '';
  const cards = renderCardsSvg(layout);

  elements.edgesSvg.setAttribute('width', String(layout.canvasWidth));
  elements.edgesSvg.setAttribute('height', String(layout.canvasHeight));
  elements.edgesSvg.setAttribute('viewBox', `0 0 ${layout.canvasWidth} ${layout.canvasHeight}`);
  elements.edgesSvg.innerHTML = `${verticalPaths}${horizontalPaths}${cards}`;
}

function renderLonely() {
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
        ? `<a class="lonely-issue-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(key)}</a>`
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

function canEverBeChartParent(issueKey) {
  if (!issueKey) {
    return false;
  }
  const issue = state.data?.issueIndex?.[issueKey];
  if (!issue) {
    return false;
  }
  return !isSubtaskIssueType(issue.issueType);
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

  // Subtasks can be assigned under standard (non-subtask) issues.
  if (isSubtaskIssueType(sourceType)) {
    return !isSubtaskIssueType(targetType);
  }

  // Standard issue hierarchy in Jira Cloud: non-subtasks are assigned under Epic.
  return isEpicIssueType(targetType);
}

function canAssignInChart(sourceKey, targetKey) {
  if (!sourceKey || !targetKey || sourceKey === targetKey) {
    return false;
  }
  if (!canDragFromChart(sourceKey) || !canBeChartParentForSource(sourceKey, targetKey)) {
    return false;
  }

  // Prevent assigning a node into its own subtree.
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

function clearChartDropTargets() {
  const targets = elements.edgesSvg.querySelectorAll('.tm-svg-card-link.chart-drop-target');
  for (const target of targets) {
    target.classList.remove('chart-drop-target');
  }
  state.chartDropTargetKey = '';
}

function clearChartDragSource() {
  const source = elements.edgesSvg.querySelector('.tm-svg-card-link.chart-drag-source');
  if (source) {
    source.classList.remove('chart-drag-source');
  }
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
  elements.viewport.classList.remove('chart-assign-dragging');
  clearChartDropTargets();
  clearChartDragSource();
  hideDragGhost();
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

function updateDragGhostPosition(clientX, clientY) {
  if (!elements.dragGhost || elements.dragGhost.classList.contains('hidden')) {
    return;
  }
  const viewportRect = elements.viewport.getBoundingClientRect();
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

function hideDragGhost() {
  if (!elements.dragGhost) {
    return;
  }
  elements.dragGhost.classList.remove('visible');
  elements.dragGhost.classList.add('hidden');
  elements.dragGhost.style.transform = 'translate(-9999px, -9999px)';
  elements.dragGhost.innerHTML = '';
}

function autoPanDuringDrag(clientX, clientY) {
  if (!state.layout) {
    return false;
  }

  const rect = elements.viewport.getBoundingClientRect();
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
  applyCamera();
  return true;
}

function stopChartAutoPanLoop() {
  if (!state.chartAutoPanRaf) {
    return;
  }
  cancelAnimationFrame(state.chartAutoPanRaf);
  state.chartAutoPanRaf = 0;
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

async function assignIssueParent(issueKey, parentKey) {
  if (!issueKey || !parentKey || issueKey === parentKey) {
    return;
  }

  try {
    state.error = '';
    state.success = '';
    state.info = `Assigning ${issueKey} -> ${parentKey}...`;
    renderStatus();
    await invoke('assignIssueParent', { issueKey, parentKey });
    state.info = 'Refreshing hierarchy...';
    renderStatus();
    await loadHierarchy({ preserveCamera: true, showLoading: false });
    state.info = '';
    showSuccessMessage(`Assigned ${issueKey} -> ${parentKey}.`);
  } catch (error) {
    state.info = '';
    state.error = error?.message || 'Failed to assign parent issue.';
    renderStatus();
  }
}

function clampPan() {
  if (!state.layout) {
    return;
  }
  const viewport = elements.viewport;
  const scaledWidth = state.layout.canvasWidth * state.zoom;
  const scaledHeight = state.layout.canvasHeight * state.zoom;
  const minX = Math.min(PAN_PADDING, viewport.clientWidth - scaledWidth - PAN_PADDING);
  const minY = Math.min(PAN_PADDING, viewport.clientHeight - scaledHeight - PAN_PADDING);
  state.panX = clamp(state.panX, minX, PAN_PADDING);
  state.panY = clamp(state.panY, minY, PAN_PADDING);
}

function applyCamera() {
  if (!state.layout) {
    return;
  }
  clampPan();
  elements.stage.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  elements.zoomLabel.textContent = `${Math.round(state.zoom * 100)}%`;
}

function fitToViewport() {
  return fitToViewportInternal(false);
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
  if (!elements.viewport) {
    return;
  }

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await elements.viewport.requestFullscreen();
    }
  } catch (error) {
    state.error = 'Unable to switch full screen mode in this browser.';
    renderStatus();
  } finally {
    updateFullscreenButton();
    fitToViewportInternal(true);
  }
}

function fitToViewportInternal(preferReadableScale) {
  if (!state.layout) {
    return;
  }
  const viewport = elements.viewport;
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
  state.panY = Math.max(
    PAN_PADDING,
    (viewport.clientHeight - state.layout.canvasHeight * state.zoom) / 2
  );
  applyCamera();
}

function renderHierarchy(options = {}) {
  const preserveCamera = Boolean(options.preserveCamera);
  const previousCamera = preserveCamera && state.layout
    ? { zoom: state.zoom, panX: state.panX, panY: state.panY }
    : null;

  const hierarchy = state.data?.hierarchy;
  state.layout = computeHierarchyLayout(hierarchy);
  if (!state.layout) {
    elements.emptyState.classList.remove('hidden');
    elements.stage.classList.add('hidden');
    renderLonely();
    return;
  }

  elements.emptyState.classList.add('hidden');
  elements.stage.classList.remove('hidden');
  elements.stage.style.width = `${state.layout.canvasWidth}px`;
  elements.stage.style.height = `${state.layout.canvasHeight}px`;
  elements.cardsLayer.innerHTML = '';
  renderEdges(state.layout);
  renderLonely();
  if (previousCamera) {
    state.zoom = clamp(previousCamera.zoom, ZOOM_MIN, ZOOM_MAX);
    state.panX = previousCamera.panX;
    state.panY = previousCamera.panY;
    applyCamera();
  } else {
    fitToViewportInternal(true);
  }
}

function syncControlsToState() {
  state.selectedIssueTypes = selectedValues(elements.issueTypeSelect);
  state.selectedEpicKeys = selectedValues(elements.epicSelect);
  state.selectedFixedVersions = selectedValues(elements.fixedVersionSelect);
  state.selectedLabels = selectedValues(elements.labelSelect);
  state.selectedComponents = selectedValues(elements.componentSelect);
  state.jql = elements.jqlInput.value || '';
  state.showRelations = Boolean(elements.showRelationsCheckbox?.checked);
  renderFilterSummary();
}

function syncStateToControls() {
  renderSelectOptions(
    elements.issueTypeSelect,
    state.issueTypes.map((item) => ({ value: item.name, label: item.name })),
    state.selectedIssueTypes
  );
  renderSelectOptions(
    elements.epicSelect,
    state.epics.map((item) => ({
      value: item.key,
      label: item.summary ? `${item.key} - ${item.summary}` : item.key,
    })),
    state.selectedEpicKeys
  );
  renderSelectOptions(
    elements.fixedVersionSelect,
    state.fixedVersions.map((item) => ({
      value: item.name,
      label: item.name,
    })),
    state.selectedFixedVersions
  );
  renderSelectOptions(
    elements.labelSelect,
    state.labels.map((item) => ({
      value: item,
      label: item,
    })),
    state.selectedLabels
  );
  renderSelectOptions(
    elements.componentSelect,
    state.components.map((item) => ({
      value: item,
      label: item,
    })),
    state.selectedComponents
  );
  elements.jqlInput.value = state.jql;
  if (elements.showRelationsCheckbox) {
    elements.showRelationsCheckbox.checked = Boolean(state.showRelations);
  }
  renderFilterSummary();
}

async function loadFilters() {
  const [issueTypes, epics, fixedVersions, labels, components] = await Promise.all([
    invoke('getIssueTypes'),
    invoke('getEpics', { projectKey: state.projectKey }),
    invoke('getFixedVersions', { projectKey: state.projectKey }),
    invoke('getProjectLabels', { projectKey: state.projectKey }),
    invoke('getProjectComponents', { projectKey: state.projectKey }),
  ]);
  state.issueTypes = issueTypes || [];
  state.epics = epics || [];
  state.fixedVersions = fixedVersions || [];
  state.labels = labels || [];
  state.components = components || [];
}

async function loadHierarchy(options = {}) {
  const preserveCamera = Boolean(options.preserveCamera);
  const showLoading = options.showLoading !== false;
  syncControlsToState();
  clearChartDragState();
  state.loading = showLoading;
  state.error = '';
  if (showLoading) {
    state.info = '';
  }
  renderStatus();
  elements.refreshButton.disabled = true;
  if (elements.refreshQuickButton) {
    elements.refreshQuickButton.disabled = true;
  }

  try {
    const data = await invoke('getMatrixData', {
      projectKey: state.projectKey,
      mode: 'hierarchical',
      issueTypes: state.selectedIssueTypes,
      epicKeys: state.selectedEpicKeys,
      fixedVersions: state.selectedFixedVersions,
      labels: state.selectedLabels,
      components: state.selectedComponents,
      jql: state.jql,
    });
    state.data = data;
    renderStats();
    renderHierarchy({ preserveCamera });
  } catch (error) {
    state.error = error?.message || 'Failed to load hierarchy data.';
    state.data = null;
    state.layout = null;
    renderStatus();
    renderStats();
    elements.stage.classList.add('hidden');
    elements.emptyState.classList.remove('hidden');
  } finally {
    state.loading = false;
    elements.refreshButton.disabled = false;
    if (elements.refreshQuickButton) {
      elements.refreshQuickButton.disabled = false;
    }
    renderStatus();
  }
}

function onWheel(event) {
  if (!state.layout) {
    return;
  }
  event.preventDefault();

  const rect = elements.viewport.getBoundingClientRect();
  const px = event.clientX - rect.left;
  const py = event.clientY - rect.top;

  if (event.shiftKey) {
    state.panX -= event.deltaX;
    state.panY -= event.deltaY;
    applyCamera();
    return;
  }

  const zoomFactor = Math.exp(-event.deltaY * 0.0015);
  const nextZoom = clamp(state.zoom * zoomFactor, ZOOM_MIN, ZOOM_MAX);
  const worldX = (px - state.panX) / state.zoom;
  const worldY = (py - state.panY) / state.zoom;
  state.zoom = nextZoom;
  state.panX = px - worldX * state.zoom;
  state.panY = py - worldY * state.zoom;

  applyCamera();
}

function onPointerDown(event) {
  if (event.button !== 0 && event.button !== 1) {
    return;
  }
  const card = event.target.closest('.tm-svg-card-link');
  if (card && !state.loading) {
    if (event.button !== 0) {
      return;
    }
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
      elements.viewport.classList.add('chart-assign-dragging');
      showDragGhost(issueKey, event.clientX, event.clientY);
      elements.viewport.setPointerCapture(event.pointerId);
    }
    return;
  }
  if (event.target.closest('.lonely-card')) {
    return;
  }
  state.isDragging = true;
  state.dragStartX = event.clientX;
  state.dragStartY = event.clientY;
  state.dragStartPanX = state.panX;
  state.dragStartPanY = state.panY;
  elements.viewport.classList.add('dragging');
  elements.viewport.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
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

  if (!state.isDragging) {
    return;
  }
  state.panX = state.dragStartPanX + (event.clientX - state.dragStartX);
  state.panY = state.dragStartPanY + (event.clientY - state.dragStartY);
  applyCamera();
}

function onPointerUp(event) {
  if (state.chartDraggedIssueKey && state.chartDragPointerId === event.pointerId) {
    const draggedKey = state.chartDraggedIssueKey;
    const dropTargetKey = state.chartDropTargetKey || '';
    const moved = state.chartDragMoved;
    const shouldAssign = moved && canAssignInChart(draggedKey, dropTargetKey);
    const pointerId = state.chartDragPointerId;

    if (elements.viewport.hasPointerCapture(pointerId)) {
      elements.viewport.releasePointerCapture(pointerId);
    }
    clearChartDragState();

    if (moved) {
      state.suppressCardClickUntil = Date.now() + 350;
    }
    if (shouldAssign) {
      void assignIssueParent(draggedKey, dropTargetKey);
    }
    return;
  }

  if (!state.isDragging) {
    return;
  }
  state.isDragging = false;
  elements.viewport.classList.remove('dragging');
  if (elements.viewport.hasPointerCapture(event.pointerId)) {
    elements.viewport.releasePointerCapture(event.pointerId);
  }
}

function onChartCardClick(event) {
  if (Date.now() <= state.suppressCardClickUntil) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
}

function bindEvents() {
  enableToggleMultiSelect(elements.issueTypeSelect);
  enableToggleMultiSelect(elements.epicSelect);
  enableToggleMultiSelect(elements.fixedVersionSelect);
  enableToggleMultiSelect(elements.labelSelect);
  enableToggleMultiSelect(elements.componentSelect);

  elements.issueTypeSelect.addEventListener('change', () => {
    syncControlsToState();
  });

  elements.epicSelect.addEventListener('change', () => {
    syncControlsToState();
  });

  elements.fixedVersionSelect.addEventListener('change', () => {
    syncControlsToState();
  });

  elements.labelSelect.addEventListener('change', () => {
    syncControlsToState();
  });

  elements.componentSelect.addEventListener('change', () => {
    syncControlsToState();
  });

  elements.jqlInput.addEventListener('input', () => {
    syncControlsToState();
  });

  elements.refreshButton.addEventListener('click', () => {
    loadHierarchy();
  });
  if (elements.refreshQuickButton) {
    elements.refreshQuickButton.addEventListener('click', () => {
      loadHierarchy();
    });
  }

  elements.resetFiltersButton.addEventListener('click', () => {
    resetAllFilters();
    loadHierarchy();
  });

  elements.zoomInButton.addEventListener('click', () => {
    state.zoom = clamp(state.zoom * 1.2, ZOOM_MIN, ZOOM_MAX);
    applyCamera();
  });

  elements.zoomOutButton.addEventListener('click', () => {
    state.zoom = clamp(state.zoom / 1.2, ZOOM_MIN, ZOOM_MAX);
    applyCamera();
  });

  elements.resetViewButton.addEventListener('click', () => {
    state.zoom = 1;
    state.panX = PAN_PADDING;
    state.panY = PAN_PADDING;
    applyCamera();
  });

  elements.fitViewButton.addEventListener('click', () => {
    fitToViewport();
  });

  elements.showRelationsCheckbox.addEventListener('change', () => {
    state.showRelations = Boolean(elements.showRelationsCheckbox.checked);
    if (state.layout) {
      renderEdges(state.layout);
    }
  });

  elements.edgesSvg.addEventListener('click', onChartCardClick, true);

  elements.fullscreenButton.addEventListener('click', () => {
    toggleFullscreen();
  });

  elements.viewport.addEventListener('wheel', onWheel, { passive: false });
  elements.viewport.addEventListener('pointerdown', onPointerDown);
  elements.viewport.addEventListener('pointermove', onPointerMove);
  elements.viewport.addEventListener('pointerup', onPointerUp);
  elements.viewport.addEventListener('pointercancel', onPointerUp);

  window.addEventListener('resize', () => {
    fitToViewportInternal(true);
  });

  document.addEventListener('fullscreenchange', () => {
    updateFullscreenButton();
    fitToViewportInternal(true);
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

    if (!state.projectKey) {
      throw new Error('Project context is missing for this page.');
    }

    await loadFilters();
    syncStateToControls();
    updateFullscreenButton();
    bindEvents();
    await loadHierarchy();
  } catch (error) {
    state.error = error?.message || 'Failed to initialize Hierarchical View.';
    renderStatus();
  }
}

void init();
