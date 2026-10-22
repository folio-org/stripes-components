import React from 'react';
import PropTypes from 'prop-types';
import css from './MCLGrid.css';
import { MCLPagingTypes } from '../..';
import PrevNextPaginationRow from './PrevNextPaginationRow';

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

const MCLGrid = ({
  columnMapping = {},
  columnWidths = {},
  contentData,
  formatter,
  maxHeight,
  stickyFirstColumn,
  stickyLastColumn,
  pagingType,
  visibleColumns,
}) => {
  const template = buildGridTemplateColumns(visibleColumns, columnWidths);

  const getCellClass = (colIndex) => {
    if (stickyFirstColumn && colIndex === 0) return `${css.gridCell} ${css.gridCellSticky}`;
    if (stickyLastColumn && colIndex === visibleColumns.length - 1) return `${css.gridCell} ${css.gridCellStickyEnd}`;
    return css.gridCell;
  };

  return (
    <div className={css.gridScrollWrapper} style={maxHeight ? { maxHeight } : undefined}>
      <div className={css.gridTable} role="grid" style={{ '--col-template': template }}>
        <div className={css.gridHeaderRow} role="row">
          {visibleColumns.map((col, i) => (
            <div key={col} className={getCellClass(i)} role="columnheader">
              <div className={css.gridHeaderInner}>
                <span className={css.gridHeaderContent}>{columnMapping[col] || col}</span>
                <span className={css.gridSortIndicatorSpace} aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
        {contentData.map((row, rowIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={rowIndex} className={css.gridBodyRow} role="row">
            {visibleColumns.map((col, i) => (
              <div key={col} className={getCellClass(i)} role="cell">
                {formatter?.[col] ? formatter[col](row) : String(row[col])}
              </div>
            ))}
          </div>
        ))}
      </div>
      {pagingType === MCLPagingTypes.PREV_NEXT && (
        <div className={css.gridPaging}>
          <PrevNextPaginationRow
            activeNext={this.getCanGoNext()}
            activePrevious={this.getCanGoPrevious()}
            dataEndReached={dataEndReached}
            handleLoadMore={this.handleLoadMore}
            id={id}
            keyId={this.keyId}
            loading={loadingState}
            loadingNext={pagingCanGoNextLoading}
            loadingPrevious={pagingCanGoPreviousLoading}
            pageAmount={pageAmount}
            pagingOffset={pagingOffset}
            rowIndex={lastIndex}
            sendMessage={this.sendMessage}
            dataStartIndex={typeof pagingOffset !== 'undefined' ? pagingOffset + 1 : dataStartIndex + 1}
            dataEndIndex={typeof pagingOffset !== 'undefined' ? pagingOffset + dataEndIndex + 1 : dataEndIndex + 1} // eslint-disable-line
            hidePageIndices={hidePageIndices}
            setFocusIndex={this.setFocusIndex}
          />
        </div>
      )}
    </div>
  );
};

MCLGrid.propTypes = {
  columnMapping: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnWidths: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  maxHeight: PropTypes.string,
  stickyFirstColumn: PropTypes.bool,
  stickyLastColumn: PropTypes.bool,
};

export default MCLGrid;
