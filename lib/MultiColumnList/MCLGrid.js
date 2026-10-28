import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useIntl } from 'react-intl';
import { debounce, isEqual, isNil, uniqueId } from 'lodash';
import css from './MCLGrid.css';
import { MCLPagingTypes } from '../..';
import SRStatus from '../SRStatus';
import Icon from '../Icon';
import EmptyMessage from '../EmptyMessage';
import { dataChangedOrLess, CHANGE_DIFFERENCE, CHANGE_LESSDATA } from './MCLRenderer';
import { getNextFocusable } from '../../util/getFocusableElements';
import PrevNextPaginationRow from './PrevNextPaginationRow';
import gridRowFormatter from './gridRowFormatter';

/* Feasibility spike only - proves out whether MCL's columnWidths prop shape (fixed
 * px/%/em/rem/vw scalars, {min,max} hint objects, or omitted-for-auto) can be resolved
 * entirely by native CSS Grid track sizing, with zero DOM measurement. This is the
 * *entire* amount of JS involved - no CellMeasurer, no DimensionCache, no sampling
 * heuristic. Compare against calculateWidth.js/CellMeasurer.js/convertToPixels.js, which
 * this is meant to replace for static-mode use. See the plan doc for full context.
 */

function toTrackSize(value) {
  if (typeof value === 'number') return `${value}px`;
  return value;
}

function getMinSide(width) {
  if (width === undefined) return 'min-content';
  if (typeof width === 'object' && width !== null) {
    return width.min !== undefined ? toTrackSize(width.min) : 'min-content';
  }
  return toTrackSize(width);
}

export function buildGridTemplateColumns(columns, columnWidths = {}) {
  const trackSizes = columns.map((col, index) => {
    const width = columnWidths[col];
    const isLast = index === columns.length - 1;
    const hasMax = typeof width === 'object' && width !== null && width.max !== undefined;

    // Mirrors MCLRenderer.js's renderCells: the last column stretches to fill any
    // remaining container width unless its columnWidths entry explicitly defines a
    // `max` - true for omitted columns, scalar widths, and {min}-only hints alike
    // (get(columnWidthsProp, `${col}.max`) is undefined in all three of those cases).
    if (isLast && !hasMax) {
      return `minmax(${getMinSide(width)}, 1fr)`;
    }

    if (width === undefined) {
      return 'minmax(min-content, max-content)';
    }
    if (typeof width === 'object' && width !== null) {
      return `minmax(${getMinSide(width)}, ${toTrackSize(width.max)})`;
    }
    return toTrackSize(width);
  });

  // Row/header boxes only span to the last *explicit* track line (grid-column: 1 / -1),
  // so when the real last column is capped by a max (no track above stretches), any
  // leftover container width sits outside all defined tracks and row backgrounds stop
  // short of the container edge. This synthetic trailing track has no data column/cell
  // rendered into it - it exists purely so spanning row boxes reach the container edge,
  // without changing any real column's width.
  trackSizes.push('minmax(0, 1fr)');
  return trackSizes.join(' ');
}

export function getCanGoNext({
  contentData,
  pagingCanGoNext,
  pagingCanGoNextLoading,
  pagingOffset,
  totalCount,
}) {
  if (pagingCanGoNextLoading) return false;
  if (!isNil(pagingCanGoNext)) return pagingCanGoNext;

  const lastItemMissing = !contentData[contentData.length - 1];
  if (!totalCount) return lastItemMissing;
  if (!isNil(pagingOffset)) return (pagingOffset + contentData.length) !== totalCount;
  return contentData.length !== totalCount || lastItemMissing;
}

export function getCanGoPrevious({
  contentData,
  pagingCanGoPrevious,
  pagingCanGoPreviousLoading,
  pagingOffset,
}) {
  if (pagingCanGoPreviousLoading) return false;
  if (!isNil(pagingCanGoPrevious)) return pagingCanGoPrevious;
  if (!isNil(pagingOffset)) return pagingOffset !== 0;
  return !contentData[0];
}

// contentData may be a sparse array when paging a slice at a time, so the first/last
// populated indices come from its keys rather than from its length.
function getDataIndices(contentData) {
  const keys = Object.keys(contentData);
  if (!keys.length) return { dataStartIndex: 0, dataEndIndex: 0, isSparse: false };
  return {
    dataStartIndex: Number.parseInt(keys[0], 10),
    dataEndIndex: Number.parseInt(keys[keys.length - 1], 10),
    isSparse: keys.length !== contentData.length,
  };
}

const MCLGrid = ({
  autosize,
  columnIdPrefix,
  columnMapping = {},
  columnWidths = {},
  contentData,
  formatter,
  getHeaderCellClass,
  headerMetadata,
  hidePageIndices,
  id,
  interactive = true,
  isEmptyMessage,
  isSelected = ({ item, criteria }) => isEqual(item, criteria),
  loading: loadingProp,
  maxHeight,
  nonInteractiveHeaders = [],
  onHeaderClick,
  onNeedMoreData,
  onRowClick,
  pageAmount = 30,
  pagingCanGoNext,
  pagingCanGoNextLoading,
  pagingCanGoPrevious,
  pagingCanGoPreviousLoading,
  pagingOffset,
  pagingType,
  dataEndReached = false,
  rowFormatter = gridRowFormatter,
  rowProps,
  selectedClass,
  selectedRow,
  showSortIndicator = false,
  sortableFields = [],
  sortDirection,
  sortedColumn,
  sortOrder,
  stickyFirstColumn,
  stickyLastColumn,
  totalCount,
  visibleColumns,
}) => {
  const { formatMessage } = useIntl();
  const template = buildGridTemplateColumns(visibleColumns, columnWidths);

  const keyId = useRef(uniqueId('mcl')).current;
  const statusRef = useRef(null);
  const scrollRef = useRef(null);
  const focusTargetIndex = useRef(null);
  const prevDataLength = useRef(contentData.length);
  const [loading, setLoading] = useState(false);

  const { dataStartIndex, dataEndIndex, isSparse } = getDataIndices(contentData);
  const firstIndex = dataStartIndex;

  const sendMessage = useCallback((message) => {
    statusRef.current?.sendMessage(message);
  }, []);

  const setFocusIndex = useCallback((index) => {
    focusTargetIndex.current = index;
  }, []);

  // Keep the latest props reachable from the debounced loader without recreating it.
  const loadMoreArgs = useRef({});
  loadMoreArgs.current = { loading, onNeedMoreData, firstIndex };

  const loadMore = useCallback((askAmount, index, direction) => {
    const { loading: isLoading, onNeedMoreData: needMore, firstIndex: first } = loadMoreArgs.current;
    if (!isLoading && needMore) {
      needMore(askAmount, index, first, direction);
      setLoading(true);
    }
  }, []);

  const debouncedLoadMore = useMemo(
    () => debounce(loadMore, 200, { trailing: true, leading: true }),
    [loadMore],
  );

  useEffect(() => () => debouncedLoadMore.cancel(), [debouncedLoadMore]);

  const handleLoadMore = useCallback((askAmount, index, direction) => {
    if (index === 0 || index === firstIndex || index % pageAmount !== 0) {
      debouncedLoadMore(askAmount, index, direction);
    } else {
      loadMore(askAmount, index, direction);
    }
  }, [debouncedLoadMore, firstIndex, loadMore, pageAmount]);

  // New data arrived: stop loading, announce growth, and restore focus after a page change.
  useEffect(() => {
    setLoading(false);
    if (prevDataLength.current && contentData.length > prevDataLength.current) {
      sendMessage(formatMessage({ id: 'stripes-components.mcl.additionalResultsLoaded' }));
    }
    prevDataLength.current = contentData.length;

    if (!isNil(focusTargetIndex.current)) {
      // empty slots only exist once sparse data has loaded; otherwise focus starts at the first row
      const targetIndex = isSparse ? focusTargetIndex.current : 0;
      const target = scrollRef.current?.querySelector(`[data-row-index="row-${targetIndex}"]`);
      if (target) {
        (getNextFocusable(target, true, true) || target).focus();
        focusTargetIndex.current = null;
      }
    }
  }, [contentData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-sorted or shrunken data starts over at the top; appended pages keep their scroll position.
  const prevContentData = useRef(contentData);
  useEffect(() => {
    const { changed, changeType } = dataChangedOrLess(prevContentData.current, contentData);
    if (changed && (changeType === CHANGE_DIFFERENCE || changeType === CHANGE_LESSDATA) && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    prevContentData.current = contentData;
  }, [contentData]);

  const handleHeaderClick = (e, name) => {
    const meta = { name, alias: columnMapping[name] || name };
    headerMetadata?.[name]?.forEach?.((prop) => {
      meta[prop] = headerMetadata[name][prop];
    });
    onHeaderClick(e, meta);
  };

  const pagingState = {
    contentData,
    pagingCanGoNext,
    pagingCanGoNextLoading,
    pagingCanGoPrevious,
    pagingCanGoPreviousLoading,
    pagingOffset,
    totalCount,
  };
  const hasOffset = typeof pagingOffset !== 'undefined';

  const getCellClass = (colIndex) => {
    if (stickyFirstColumn && colIndex === 0) return `${css.gridCell} ${css.gridCellSticky}`;
    if (stickyLastColumn && colIndex === visibleColumns.length - 1) return `${css.gridCell} ${css.gridCellStickyEnd}`;
    return css.gridCell;
  };

  const isRowSelected = (item, rowIndex) => isSelected({ item, rowIndex, criteria: selectedRow });

  const getRowClass = (item, rowIndex) => classnames(
    css.gridBodyRow,
    { [selectedClass || css.gridSelected]: isRowSelected(item, rowIndex) },
    { [css.gridInteractive]: interactive },
    { [css.gridClickableRow]: onRowClick },
  );

  const handleRowClick = (e, row) => {
    e.preventDefault();
    e.stopPropagation();
    onRowClick(e, row);
  };

  // Enter/Space only activate the row itself; inside controls (links, checkboxes) keep their own behavior.
  const handleRowKeyDown = (e, row) => {
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
      handleRowClick(e, row);
    }
  };

  const renderHeader = (col, i) => {
    const slug = col === ' ' ? i : col.replace(/\s/g, '').toLowerCase();
    const idPrefix = columnIdPrefix ? `${columnIdPrefix}-` : '';
    const isSorted = sortOrder === col || sortedColumn === col;
    const isInteractive = !!onHeaderClick && !nonInteractiveHeaders.includes(col);
    const isSortable = sortableFields.length ? sortableFields.includes(col) : isInteractive;
    const customClass = typeof getHeaderCellClass === 'function' ? getHeaderCellClass(col) : undefined;
    const label = columnMapping[col] || col;

    const content = (
      <div className={css.gridHeaderInner}>
        <span className={css.gridHeaderContent}>{label}</span>
        <span
          className={classnames(css.gridSortIndicatorSpace, {
            [css.gridAscending]: isSorted && sortDirection === 'ascending',
            [css.gridDescending]: isSorted && sortDirection === 'descending',
            [css.gridSortable]: showSortIndicator && isSortable && !isSorted,
          })}
          aria-hidden="true"
        />
      </div>
    );

    return (
      <div
        key={col}
        id={`${idPrefix}list-column-${slug}`}
        className={classnames(getCellClass(i), customClass, {
          [css.gridHeaderClickable]: isInteractive,
          [css.gridHeaderSorted]: isSorted,
        })}
        role="columnheader"
        aria-sort={isSorted ? sortDirection : 'none'}
      >
        {isInteractive ? (
          <div
            role="button"
            tabIndex="0"
            className={css.gridHeaderButton}
            data-test-clickable-header
            id={`${idPrefix}clickable-list-column-${slug}`}
            onClick={(e) => handleHeaderClick(e, col)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleHeaderClick(e, col); }}
            onKeyUp={(e) => { if (e.key === ' ') handleHeaderClick(e, col); }}
          >
            {content}
          </div>
        ) : content}
      </div>
    );
  };

  if (contentData.length === 0 && !loadingProp) {
    return (
      <div className={css.gridEmptyMessage} id={id ? `${id}-empty` : undefined}>
        {typeof isEmptyMessage === 'string' ? <EmptyMessage>{isEmptyMessage}</EmptyMessage> : isEmptyMessage}
      </div>
    );
  }

  return (
    <div
      className={classnames(css.gridContainer, { [css.gridContainerAutosize]: autosize })}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <SRStatus ref={statusRef} />
      <div className={css.gridScrollWrapper} ref={scrollRef}>
        <div className={css.gridTable} id={id} role="grid" style={{ '--col-template': template }}>
          <div className={css.gridHeaderRow} role="row">
            {visibleColumns.map(renderHeader)}
          </div>
          {contentData.map((row, rowIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={rowIndex}>
              {rowFormatter({
                rowIndex,
                rowClass: getRowClass(row, rowIndex),
                rowData: row,
                rowProps: {
                  'aria-selected': isRowSelected(row, rowIndex) || undefined,
                  'data-row-index': `row-${rowIndex}`,
                  tabIndex: onRowClick ? 0 : undefined,
                  onClick: onRowClick ? (e) => handleRowClick(e, row) : undefined,
                  onKeyDown: onRowClick ? (e) => handleRowKeyDown(e, row) : undefined,
                  ...rowProps,
                },
                cells: visibleColumns.map((col, i) => (
                  <div key={col} className={getCellClass(i)} role="cell">
                    {formatter?.[col] ? formatter[col](row) : String(row[col])}
                  </div>
                )),
                columns: visibleColumns,
                columnMapping,
                interactive,
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      {loadingProp && (
        <div className={css.gridContentLoadingRow}>
          <div className={css.gridContentLoading}>
            <Icon icon="spinner-ellipsis" width="35px" />
          </div>
        </div>
      )}
      {pagingType === MCLPagingTypes.PREV_NEXT && (
        <div className={css.gridPaging}>
          <PrevNextPaginationRow
            activeNext={getCanGoNext(pagingState)}
            activePrevious={getCanGoPrevious(pagingState)}
            dataEndReached={dataEndReached}
            handleLoadMore={handleLoadMore}
            id={id}
            keyId={keyId}
            loading={loading}
            loadingNext={pagingCanGoNextLoading}
            loadingPrevious={pagingCanGoPreviousLoading}
            pageAmount={pageAmount}
            pagingOffset={pagingOffset}
            rowIndex={dataEndIndex}
            sendMessage={sendMessage}
            dataStartIndex={(hasOffset ? pagingOffset : dataStartIndex) + 1}
            dataEndIndex={(hasOffset ? pagingOffset + dataEndIndex : dataEndIndex) + 1}
            hidePageIndices={hidePageIndices}
            setFocusIndex={setFocusIndex}
          />
        </div>
      )}
    </div>
  );
};

MCLGrid.propTypes = {
  autosize: PropTypes.bool,
  columnIdPrefix: PropTypes.string,
  getHeaderCellClass: PropTypes.func,
  headerMetadata: PropTypes.object,
  isEmptyMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  loading: PropTypes.bool,
  interactive: PropTypes.bool,
  isSelected: PropTypes.func,
  nonInteractiveHeaders: PropTypes.arrayOf(PropTypes.string),
  onHeaderClick: PropTypes.func,
  onRowClick: PropTypes.func,
  rowFormatter: PropTypes.func,
  rowProps: PropTypes.object,
  selectedClass: PropTypes.string,
  selectedRow: PropTypes.object,
  showSortIndicator: PropTypes.bool,
  sortableFields: PropTypes.arrayOf(PropTypes.string),
  sortDirection: PropTypes.oneOf(['ascending', 'descending']),
  sortedColumn: PropTypes.string,
  sortOrder: PropTypes.string,
  columnMapping: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnWidths: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  maxHeight: PropTypes.string,
  stickyFirstColumn: PropTypes.bool,
  stickyLastColumn: PropTypes.bool,
  dataEndReached: PropTypes.bool,
  hidePageIndices: PropTypes.bool,
  id: PropTypes.string,
  onNeedMoreData: PropTypes.func,
  pageAmount: PropTypes.number,
  pagingCanGoNext: PropTypes.bool,
  pagingCanGoNextLoading: PropTypes.bool,
  pagingCanGoPrevious: PropTypes.bool,
  pagingCanGoPreviousLoading: PropTypes.bool,
  pagingOffset: PropTypes.number,
  pagingType: PropTypes.string,
  totalCount: PropTypes.number,
};

export default MCLGrid;
