import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import {
  isEqual,
  isEqualWith,
  debounce,
  throttle,
  uniqueId,
} from 'lodash';

import Icon from '../Icon';
import EmptyMessage from '../EmptyMessage';
import { HotKeys } from '../HotKeys';
import css from './MCLRenderer.css';
import defaultRowFormatter from './defaultRowFormatter';
import CellMeasurer from './CellMeasurer';
import RowMeasurer from './RowMeasurer';
import LoaderRow from './LoaderRow';
import EndOfList from './EndOfList';
import DimensionCache from './DimensionCache';

import * as baseHandlers from './defaultHandlers';
import { calculateColumnWidth3q, convertToPixels } from './calculateWidth';
import RowPositioner from './RowPositioner';

const propTypes = {
  autosize: PropTypes.bool,
  columnMapping: PropTypes.object,
  columnOverflow: PropTypes.object,
  columnWidths: PropTypes.object,
  containerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  contentData: PropTypes.arrayOf(PropTypes.object),
  formatter: PropTypes.object,
  headerMetadata: PropTypes.object,
  headerRowClass: PropTypes.string,
  height: PropTypes.number,
  hotKeys: PropTypes.object,
  id: PropTypes.string,
  instanceRef: PropTypes.func,
  interactive: PropTypes.bool,
  isEmptyMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
  ]),
  loading: PropTypes.bool,
  maxHeight: PropTypes.number,
  minimumRowHeight: PropTypes.number,
  onHeaderClick: PropTypes.func,
  onNeedMoreData: PropTypes.func,
  onRowClick: PropTypes.func,
  onScroll: PropTypes.func,
  rowFormatter: PropTypes.func,
  rowMetadata: PropTypes.arrayOf(PropTypes.string),
  rowProps: PropTypes.object,
  scrollToIndex: PropTypes.number,
  selectedClass: PropTypes.string,
  selectedRow: PropTypes.object,
  sortDirection: PropTypes.oneOf(['ascending', 'descending']),
  sortedColumn: PropTypes.string,
  sortOrder: PropTypes.string,
  striped: PropTypes.bool,
  totalCount: PropTypes.number,
  virtualize: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
  width: PropTypes.number,
  wrapCells: PropTypes.bool,
};

const defaultProps = {
  columnMapping: {},
  columnOverflow: {},
  containerRef: React.createRef(),
  contentData: [],
  formatter: {},
  hotKeys: { keyMap: {}, handlers: {} },
  interactive: true,
  isEmptyMessage: <FormattedMessage id="stripes-components.tableEmpty" />,
  onScroll: () => { },
  rowFormatter: defaultRowFormatter,
  rowProps: {},
  scrollToIndex: 0,
  selectedClass: css.mclSelected,
  striped: true,
  totalCount: 0,
  minimumRowHeight: 24,
};

/* some item fields will have arrays... those don't always come back in the same
*  order, despite the item being the same. This function checks for equality with that in mind.
*/
function comparison(obj, oth) {
  if (obj === oth) return true;
  if (obj === undefined || oth === undefined) return true;
  const objType = typeof obj;
  const othType = typeof oth;
  if (objType !== othType) return false;
  const objIsArray = Array.isArray(obj);
  const othIsArray = Array.isArray(oth);
  if (objIsArray && othIsArray) {
    if (obj.length !== oth.length) return false;
    if (obj.length > 0) {
      const itemIndex = oth.findIndex(i => isEqual(i, obj[0]));
      if (itemIndex === -1) return false;
    }
    return true;
  }
  return undefined;
}

function dataChangedOrLess(previous, current) {
  // Filtering... smaller data always a change
  if (previous.length > current.length) return true;
  /* greater data length could be paging... so check to see the data is the same,
  * keeping in mind those array order changes that can happen using the comparison function.
  */
  for (let i = 0; i < previous.length - 1; i += 4) {
    const notEqual = !isEqualWith(previous[i], current[i], comparison);
    if (notEqual) return true;
  }
  // finally, compare the last item...
  const currentLast = current.length - 1;
  if (!isEqualWith(current[currentLast], previous[currentLast], comparison)) return true;
  return false;
}

// if no visibleColumns prop is provided, this function is used to generate a columns array for state.
function initColumnsFromData(item, headerMeta, rowMeta) {
  const columns = [];

  Object.keys(item).forEach((header) => {
    // by default, hide rowMetadata and headerMetadata
    const hind = headerMeta ? headerMeta.indexOf(header) : -1;
    const rind = rowMeta ? rowMeta.indexOf(header) : -1;
    if (hind === -1 && rind === -1) {
      columns.push(header);
    }
  });

  return columns;
}

class MCLRenderer extends React.Component {
  constructor(props) {
    super(props);

    const { contentData, scrollToIndex } = this.props;

    this.rowContainer = React.createRef();
    this.headerRow = React.createRef();
    this.headerContainer = React.createRef();
    this.container = this.props.containerRef;
    this.scrollContainer = React.createRef();
    this.endOfList = React.createRef();
    this.headerHeight = 0;
    this.focusedRowIndex = null;
    this.maximumRowHeight = 24;
    this.keyId = uniqueId('mcl');

    this.generateHeaders = this.generateHeaders.bind(this);
    this.debouncedLoadMore = debounce(this._loadMore.bind(this), 200, { trailing: true, leading: true });
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.getRowClass = this.getRowClass.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.getRowData = this.getRowData.bind(this);
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.getHeaderClassName = this.getHeaderClassName.bind(this);
    this.renderRows = this.renderRows.bind(this);
    this.maybeUpdateWidths = this.maybeUpdateWidths.bind(this);
    this.throttledHandleScroll = throttle(this.handleInfiniteScroll.bind(this), 32);

    const columnsFromProps = {};
    let rowWidth = null;
    if (props.columnWidths) {
      for (const c in props.columnWidths) {
        if (Object.prototype.hasOwnProperty.call(props.columnWidths, c)) {
          columnsFromProps[c] = convertToPixels(
            props.columnWidths[c],
            props.width || window.innerWidth,
          );
        }
      }
      if (props.visibleColumns && Object.keys(columnsFromProps).length === props.visibleColumns.length) {
        rowWidth = Object.keys(columnsFromProps)
          .reduce((sum, k) => sum + columnsFromProps[k], 0);
      }
    }

    this.state = {
      columns: null,
      receivedRows: contentData.length,
      firstIndex: scrollToIndex,
      scrollTop: 0,
      loading: false,
      headerWidths: {},
      columnWidths: columnsFromProps,
      widthdimensionCache:{},
      averageRowHeight: 0,
      endOfListHeight: null,
      prevHeight: 0,
      prevWidth: 0,
      maxScrollDelta: 0,
      rowWidth
    };

    this.handlers = Object.assign({
      selectPreviousRow: (e) => { baseHandlers.selectPreviousRow(e); },
      selectNextRow: this.selectNextRow,
      selectFirstOrCurrentRow: this.selectFirstOrCurrentRow,
      unfocusRow: this.unFocusRow,
      focusBeyond: this.focusBeyond,
    }, this.props.hotKeys.handlers);

    if (Object.prototype.hasOwnProperty.call(props, 'instanceRef')) {
      props.instanceRef(this);
    }

    this.positionCache = new DimensionCache(24, 0, 0);
    this.rowHeightCache = new DimensionCache(24, 0, 0);
    this.headerWidths = new DimensionCache(null);
    this.widthCache = {};
  }

  static getDerivedStateFromProps(props, state) {
    const {
      columns,
      receivedRows,
      prevHeight,
    } = state;

    const {
      contentData,
      totalCount,
      visibleColumns,
      height,
      headerMetadata,
      rowMetadata,
      scrollToIndex,
      columnWidths,
      width
    } = props;

    let newState = {};

    if (width && width !== state.prevWidth) {
      const columnsFromProps = {};
      for (const c in columnWidths) {
        if (Object.prototype.hasOwnProperty.call(props.columnWidths, c)) {
          columnsFromProps[c] = convertToPixels(
            props.columnWidths[c],
            width,
          );
        }
      }
      newState.columnWidths = columnsFromProps;
      newState.prevWidth = width;
      if (columns && Object.keys(newState.columnWidths).length === columns.length) {
        newState.rowWidth = Object.keys(newState.columnWidths)
          .reduce((sum, k) => sum + parseInt(newState.columnWidths[k], 10), 0);
      }
    }

    // data has changed
    if (receivedRows !== contentData.length) {
      newState.receivedRows = contentData.length;
      newState.loading = false;
      // set last index if we recieved data for the first time;
      if (receivedRows === 0) {
        newState.lastIndex = scrollToIndex + Math.min(contentData.length, 30);
        if (totalCount && newState.lastIndex > totalCount) {
          newState.lastIndex = totalCount - 1;
        }
      }

      // smaller incoming data set (filter/query change) reset
      if (contentData.length < receivedRows) {
        newState.receivedRows = 0;
        newState.firstIndex = 0;
      }

      newState = Object.assign(newState, { receivedRows: contentData.length });
    }

    if (height && prevHeight !== height) {
      newState = Object.assign(newState, { prevHeight: height });
    }

    // if we just received data for the first time or after reset (no columns)
    if (!columns || (
      visibleColumns &&
      visibleColumns.length > 0 &&
      !isEqual(columns, visibleColumns)
    )) {
      newState.columns = visibleColumns ||
        initColumnsFromData(contentData[0] || {}, headerMetadata, rowMetadata);
    }

    if (Object.keys(newState).length > 0) {
      return newState;
    }
    return null;
  }

  componentDidMount() {
    const {
      contentData,
    } = this.props;

    if (contentData.length > 0) {
      if (this.headerRow.current) {
        this.headerHeight = this.headerRow.current.offsetHeight;
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { columnWidths, width } = this.props;

    let newState = {};

    // if there's no set width prop, column widths should be re-evaluated after mount
    // based on the width of the containing element.
    if (this.state.prevWidth === 0) {
      if (this.container.current) {
        const containerWidth = this.container.current.offsetWidth;
        if (containerWidth !== 0) {
          newState.prevWidth = containerWidth;
          newState.columnWidths = {};
          if (columnWidths) {
            for (const c in columnWidths) {
              if (Object.prototype.hasOwnProperty.call(columnWidths, c)) {
                newState.columnWidths[c] = convertToPixels(
                  columnWidths[c],
                  newState.prevWidth,
                );
              }
            }
            if (Object.keys(newState.columnWidths).length === Object.keys(columnWidths).length) {
              newState.rowWidth = Object.keys(newState.columnWidths)
                .reduce((sum, k) => sum + newState.columnWidths[k], 0);
            }
          }
        }
      }
    }

    // data is different, but the length is the same, so reset scroll...(sorting causes this)
    if (dataChangedOrLess(prevProps.contentData, this.props.contentData)) {
      this.resetCaches();
      this.maximumRowHeight = this.props.minimumRowHeight;
      if (this.scrollContainer.current) {
        this.scrollContainer.current.scrollTop = 0;
      }
      newState.scrollTop = 0;
      newState.columnWidths = {};
      if (columnWidths) {
        for (const c in columnWidths) {
          if (Object.prototype.hasOwnProperty.call(columnWidths, c)) {
            newState.columnWidths[c] = convertToPixels(
              columnWidths[c],
              width || this.state.prevWidth || newState.prevWidth,
            );
          }
        }
        if (Object.keys(newState.columnWidths).length === Object.keys(columnWidths).length) {
          newState.rowWidth = Object.keys(newState.columnWidths)
            .reduce((sum, k) => sum + newState.columnWidths[k], 0);
        }
      }
      newState.averageRowHeight = 0;
      newState.firstIndex = 0;
    }

    if ((prevProps.width !== this.props.width) || (prevProps.height !== this.props.height)) {
      if (prevProps.width || prevProps.height) {
        if (this.positionCache.length > 1) {
          this.focusTarget = this.focusedRowIndex;
          let newBase = this.state.firstIndex;
          if (this.focusedRowIndex !== null) {
            newBase = this.focusedRowIndex;
          }
          const amount = this.positionCache.request(newBase);
          this.positionCache.clearAll();
          this.positionCache.set(newBase, amount);
          this.rowHeightCache.rebase(newBase, amount);
          // this.maximumRowHeight = this.props.minimumRowHeight;
          // newState.averageRowHeight = 0;
          this.keyId = uniqueId('mcl');
        }
      }
    }

    if (this.props.maxHeight && !this.props.height) {
      // height + scrollbar height (15)...
      const bodyHeight = this.rowHeightCache.requestAccumulated(this.rowHeightCache.length) + 17;
      if (bodyHeight !== this.state.bodyHeight) {
        if (bodyHeight) newState.bodyHeight = bodyHeight;
      }
    }

    // no measured rowHeights, no average height.
    if (
      this.props.contentData.length > 0 &&
      this.rowHeightCache.length > 0 &&
      this.state.averageRowHeight === 0
    ) {
      if (this.headerRow.current) {
        this.headerHeight = this.headerRow.current.offsetHeight;
      }

      const avg = this.updateAverageHeight();
      if (avg > 0) {
        newState = Object.assign(newState, { averageRowHeight: avg });
      }
    }

    // only setState in cDU under certain conditions...
    if (Object.keys(newState).length > 0) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(newState);
    }
  }

  componentWillUnmount() {
    this.debouncedLoadMore.cancel();
    this.throttledHandleScroll.cancel();
    this.resetCaches();
  }

  resetCaches = () => {
    this.rowHeightCache.clearAll();
    this.positionCache.clearAll();
    for (const field in this.widthCache) {
      if (Object.prototype.hasOwnProperty.call(this.widthCache, field)) {
        this.widthCache[field].clearAll();
      }
    }
    // change key so that mounted rows will re-mount.
    this.keyId = uniqueId('mcl');
  }

  backToTop = () => {
    this.rowHeightCache = [];
    if (this.scrollContainer.current) {
      this.scrollContainer.current.scrollTop = 0;
    }
    this.setState({
      firstIndex: 0,
      scrollTop: 0,
    });
  };

  handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const scrollLeft = e.target.scrollLeft;
    // console.log('handle scroll');
    if (this.props.virtualize) {
      this.throttledHandleScroll(scrollTop, scrollLeft);
    }

    this.scrollRAF = requestAnimationFrame(() => {
      if (this.headerRow.current && this.scrollContainer.current) {
        const rowElem = this.rowContainer.current.querySelector(`.${css.mclRow}`);
        if (rowElem) {
          this.headerRow.current.style.width = `${rowElem.offsetWidth + 12}px`;
        }
        this.headerContainer.current.scrollLeft = this.scrollContainer.current.scrollLeft;

        const eOL = this.endOfList.current;
        if (eOL) {
          eOL.style.left = `${this.scrollContainer.current.scrollLeft}px`;
          // 5 pixels are needed to allow recalculation of the list row items when details pane is closed
          // eOL.style.left = `${Math.max(this.headerRow.current.scrollLeft - 5, 0)}px`;
        }
      }
    });

    this.props.onScroll(e);
  }

  handleInfiniteScroll = (currentScroll, currentScrollLeft, index) => {
    const nextState = {
      scrollTop: currentScroll,
      scrollLeft: currentScrollLeft,
      scrollDirection: this.state.scrollTop > currentScroll ? 'up' : 'down'
    };

    let currentScrollDelta = Math.abs(this.state.scrollTop - currentScroll);
    // if the same scroll direction, accumulate scrollDirection
    if (nextState.scrolldirection === this.state.scrollDirection) {
      if (currentScrollDelta > this.state.maxScrollDelta) {
        nextState.maxScrollDelta = currentScrollDelta;
      } else {
        currentScrollDelta = this.state.maxScrollDelta;
      }
    } else {
      nextState.scrollDirection = currentScrollDelta;
    }

    if (nextState.scrollDirection === 'down') currentScrollDelta = 0;

    // look before is a minimumRow + a maximumRowHeight before the currentScroll.
    if (!index) {
      const startPosition = currentScroll - (this.props.minimumRowHeight + this.maximumRowHeight + currentScrollDelta);
      nextState.firstIndex = this.rowHeightCache.getIndexByPosition(startPosition, this.state.averageRowHeight);
      if (nextState.firstIndex < 0) nextState.firstIndex = 0;
    } else {
      nextState.firstIndex = index;
    }

    this.setState({
      ...nextState,
    });
  };

  // Row logic

  updateAverageHeight = () => {
    let sum = 0;
    this.rowHeightCache.forEach((l) => { sum += l; });
    const avg = sum > 0 ? sum / this.rowHeightCache.length : 0;
    return avg;
  };

  getRowClass = (rowIndex) => {
    const selectedClass = this.props.selectedClass ? this.props.selectedClass : css.mclSelected;

    return classnames(
      css.mclRow,
      { [css.mclWrappedCells]: this.props.wrapCells },
      // Striped rows
      { [css.mclIsOdd]: this.props.striped && (rowIndex % 2 === 0) },
      // Is selected
      { [`${selectedClass}`]: this.maybeSelected(this.props.selectedRow, rowIndex) },
      // whether the table contains interactive rows
      { [css.mclIsInteractive]: this.props.interactive },
    );
  };

  handleRowClick = (e, row) => {
    if (this.props.onRowClick) {
      e.preventDefault();
      this.props.onRowClick(e, row);
    }
  };

  handleRowFocus = (rowIndex) => {
    this.focusedRowIndex = rowIndex;
  }

  handleRowBlur = () => {
    this.focusedRowIndex = null;
  }

  maybeSelected = (criteria, rowIndex) => {
    const row = this.props.contentData[rowIndex];
    let selected = criteria && Object.keys(criteria).length > 0;
    for (const prop in criteria) {
      if (typeof criteria[prop] !== 'object') {
        if (criteria[prop] !== row[prop]) {
          selected = false;
          break;
        }
      } else if (!isEqual(criteria[prop], row[prop])) {
        selected = false;
        break;
      }
    }
    return selected;
  };

  setRowContainerHeight = (amount, rowIndex) => {
    this.lastRowRendered = rowIndex;
    this.containerHeight = amount;
  }

  stayPositive = (amount, rowIndex) => {
    if (amount !== 0 && rowIndex === 0) {
      this.positionCache.clearAll();
      this.rowHeightCache.rebase(0, 0);
      this.keyId = uniqueId('mcl');
      this.forceUpdate();
    }
  }

  checkForMaxHeight = (amount) => {
    if (amount > this.maximumRowHeight) {
      this.maximumRowHeight = amount;
    }
  }

  getRowData = (rowIndex) => this.props.contentData[rowIndex];

  /*  Cell-widths are measured first. These are calculated and compared with
      the width of the headers, greatest one prevailing.
      Next, row heights are measured, and stored in the height cache.
      Last, rows are positioned absolutely, positions also cached.
  */
  renderRows() {
    const {
      minimumRowHeight,
      width,
      maxHeight,
      contentData,
      columnMapping,
      interactive,
      totalCount,
      virtualize,
      rowFormatter,
      onNeedMoreData,
      rowProps: pRowProps,
    } = this.props;

    const {
      firstIndex,
      columnWidths,
      scrollTop,
      columns,
      averageRowHeight,
      rowWidth,
      maxScrollDelta,
      scrollDirection,
      prevHeight,
    } = this.state;

    const rows = [];

    const defaultStyle = (rowWidth) ? { minWidth: `${rowWidth}px` } : null;
    const scrollRange = scrollDirection === 'down' ? maxScrollDelta : 0;

    let bodyExtent;
    const bodyHeight = prevHeight || maxHeight;
    if (virtualize && bodyHeight) {
      bodyExtent = bodyHeight + scrollTop;
    } else if (this.scrollContainer.current && virtualize) {
      bodyExtent = this.scrollContainer.current.offsetHeight;
    } else if (!virtualize && this.rowContainer.current) {
      bodyExtent = this.rowContainer.current.offsetHeight;
    } else {
      bodyExtent = 500;
    }

    /* look-ahead of a minimumRow + a maximumRow.
      This improves UX in scrolling (reducing white gaps at the top/bottom of the visible rows)
    */
    bodyExtent += (minimumRowHeight + this.maximumRowHeight + scrollRange * 2);
    // let rendered = 0;
    let currentTop = firstIndex > 0 ? scrollTop : 0;
    const loaderSettings = {
      load: true,
      visible: true,
    };

    if (!onNeedMoreData) {
      loaderSettings.load = false;
    }
    if (!totalCount) {
      loaderSettings.visible = false;
    }

    let rowsRendered = firstIndex;
    let renderPosition = firstIndex;
    const heightIncrement = averageRowHeight || minimumRowHeight;
    this.rowHeightCache.fillerItem = heightIncrement;

    for (
      let rowIndex = firstIndex;
      ((currentTop <= bodyExtent) && (totalCount ? rowIndex < totalCount : true));
      currentTop += minimumRowHeight, rowIndex += 1, renderPosition += 1
    ) {
      if (contentData[rowIndex]) {
        const defaultRowProps = {
          // eslint-disable-next-line
          onClick: (e) => { this.handleRowClick(e, this.getRowData(rowIndex)); },
          style: defaultStyle,
        };
        const cellObject = this.renderCells(rowIndex);

        const rowClass = this.getRowClass(rowIndex);
        const rowProps = Object.assign(defaultRowProps, pRowProps);
        const injectedRowProps = {
          rowIndex,
          rowClass,
          rowData: contentData[rowIndex],
          rowProps,
          width,
          columnWidths,
          columns,
          columnMapping,
          interactive,
          ...cellObject, // cells, labelStrings
        };

        rows.push(
          <RowPositioner
            key={`row-positioner-${rowIndex}-${this.keyId}`}
            positionCache={this.positionCache}
            onPosition={this.stayPositive}
            heightCache={this.rowHeightCache}
            rowIndex={rowIndex}
          >
            { /*  rowIndex passed through to children as localRowIndex since
                  the outer scope rowIndex changes */
              ({ localRowIndex, position }) => {
                let measurerStyle;
                if (position !== null) {
                  measurerStyle = { top: `${position}px` };
                } else {
                  measurerStyle = { top: '100%' };
                }
                if (!virtualize) measurerStyle = { position: 'static' };
                return (
                  <RowMeasurer
                    heightCache={this.rowHeightCache}
                    style={measurerStyle}
                    rowIndex={localRowIndex}
                    measure={columns.length === Object.keys(columnWidths).length}
                    onMeasure={this.checkForMaxHeight}
                    onFocus={this.handleRowFocus}
                    onBlur={this.handleRowBlur}
                    key={`row-measurer-${localRowIndex}-${this.keyId}`}
                  >
                    {rowFormatter(injectedRowProps)}
                  </RowMeasurer>
                );
              }
            }
          </RowPositioner>
        );
        rowsRendered += 1;
      } else if (loaderSettings.load && (totalCount === 0 || rowIndex < totalCount)) {
        rows.push(
          <RowPositioner
            key={`row-loader-positioner-${rowIndex}-${this.keyId}`}
            heightCache={this.rowHeightCache}
            positionCache={this.positionCache}
            averageHeight={heightIncrement}
            rowIndex={rowIndex}
          >
            { /*  rowIndex passed through to children as localRowIndex since
                  the outer scope rowIndex changes */
              ({ localRowIndex, position }) => (
                <LoaderRow
                  key={`loader-row-${localRowIndex}-${this.keyId}`}
                  askAmount={totalCount ? Math.min(30, totalCount - contentData.length) : 30}
                  height={heightIncrement}
                  rowIndex={localRowIndex}
                  loadMore={this.handleLoadMore}
                  className={`${css.mclRow} ${localRowIndex % 2 !== 0 ? '' : css.mclIsOdd}`}
                  columns={columns}
                  styleTop={position}
                  columnWidths={columnWidths}
                />
              )
            }
          </RowPositioner>
        );
      }
    }

    const endIndex = onNeedMoreData ? renderPosition : rowsRendered;
    // keep a count of the amount of rows rendered in the view.
    this.rowCount = endIndex - firstIndex;
    rows.push(
      <RowPositioner
        key={`end-of-list-positioner-${renderPosition}-${this.keyId}`}
        heightCache={this.rowHeightCache}
        positionCache={this.positionCache}
        rowIndex={endIndex}
        onPosition={this.setRowContainerHeight}
      >
        { ({ position }) => {
          const endOfListContainerStyle = {
            position: 'absolute',
            overflow: 'hidden'
          };
          if (position !== null) {
            endOfListContainerStyle.top = `${position}px`;
          }
          return (
            <div data-end-of-list={endIndex} style={endOfListContainerStyle}>
              <EndOfList
                width={width - 20}
                innerRef={this.endOfList}
                visible={virtualize && (totalCount > 0 && totalCount <= renderPosition)}
              />
            </div>
          );
        }}
      </RowPositioner>
    );

    return rows;
  }

  renderCells(rowIndex) {
    const { formatter, contentData, columnOverflow } = this.props;
    const { columnWidths, prevWidth } = this.state;

    const cells = [];
    const labelStrings = [];
    this.state.columns.forEach((col) => {
      let value;
      let stringValue;

      if (formatter && Object.prototype.hasOwnProperty.call(formatter, col)) {
        value = formatter[col]({ ...contentData[rowIndex], rowIndex });
        stringValue = value;
      } else {
        value = contentData[rowIndex][col];
        stringValue = value;
      }

      if (typeof value === 'object') {
        if (React.isValidElement(value)) {
          stringValue = value.props.title ? value.props.title : null;
        } else {
          console.warn( // eslint-disable-line no-console
            `Formatter possibly needed for column '${col}': value is object`, value
          );
          stringValue = null;
        }
      }

      if (typeof value === 'boolean') {
        value = value ? (<span>&#10003;</span>) : '';
        stringValue = value ? 'yes' : 'no';
      }

      let cellStyle = null;
      if (columnWidths) {
        cellStyle = { width: this.state.columnWidths[col] };
      }

      const showOverflow = (columnOverflow[col]) ? css.mclShowOverflow : '';
      cells.push((
        <div
          role="gridcell"
          key={`${col}-${rowIndex}-${this.keyId}`}
          className={`${css.mclCell} ${showOverflow}`}
          style={cellStyle}
        >
          <CellMeasurer
            widthCache={this.widthCache[col]}
            rowIndex={rowIndex}
            columnName={col}
            measure={(prevWidth > 0) && (!columnWidths || !columnWidths[col])}
            onMeasure={this.maybeUpdateWidths}
            key={`cell-${col}-row-${rowIndex}-${this.keyId}`}
          >
            {value}
          </CellMeasurer>
        </div>
      ));

      labelStrings.push(`${this.getMappedColumnName(col)}: ${stringValue}`);
    });

    return { cells, labelStrings };
  }

  // Column Logic
  // eslint-disable-next-line no-unused-vars
  maybeUpdateWidths(rowIndex, columnName, width) {
    const { columnWidths, prevHeight } = this.state;
    const { contentData, minimumRowHeight } = this.props;
    const minHeightSample = prevHeight > 0 ? prevHeight / minimumRowHeight : 15;
    const sample = Math.min(contentData.length, minHeightSample);
    if (!this.calculatedColumns) this.calculatedColumns = {};
    if (this.widthCache[columnName].length >= sample &&
      !columnWidths[columnName] &&
      !this.calculatedColumns[columnName]) {
      // there may be other calculation types later... or possibly a prop for this function...
      const newWidth = calculateColumnWidth3q(
        this.widthCache[columnName],
        this.headerWidths,
        columnName,
      );
      // to avoid re-calculating, track the calculated columns at the instance level.
      this.calculatedColumns[columnName] = newWidth;
      this.setState(curState => {
        const newState = {
          columnWidths: { ...curState.columnWidths, [columnName]: newWidth }
        };
        newState.rowWidth = Object.keys(newState.columnWidths)
          .reduce((sum, k) => sum + parseInt(newState.columnWidths[k], 10), 0);
        return newState;
      }, () => {
        this.calculatedColumns = {};
      });
    }
  }

  getMappedColumnName = (column) => {
    const { columnMapping } = this.props;
    if (!columnMapping) {
      return column;
    }

    if (Object.prototype.hasOwnProperty.call(columnMapping, column)) {
      return columnMapping[column];
    }

    return column;
  };

  getHeaderClassName = (column, sortedBy) => {
    return classnames(
      css.mclHeader,
      { [`${css.mclClickable}`]: (Object.prototype.hasOwnProperty.call(this.props, 'onHeaderClick')) },
      { [`${css.mclSorted}`]: sortedBy },
      { [`${css.mclAscending}`]: (sortedBy && this.props.sortDirection === 'ascending') },
      { [`${css.mclDescending}`]: (sortedBy && this.props.sortDirection === 'descending') },
    );
  };

  handleHeaderClick = (e, name) => {
    const alias = this.props.columnMapping[name] || name;
    const meta = { name, alias };
    if (this.props.headerMetadata) {
      this.props.headerMetadata[name].forEach((prop) => {
        meta[prop] = this.props.headerMetadata[name][prop];
      });
    }
    if (Object.prototype.hasOwnProperty.call(this.props, 'onHeaderClick')) {
      this.props.onHeaderClick(e, meta);
    }
  };

  generateHeaders() {
    const { columnWidths, columns, prevWidth } = this.state;
    const { onHeaderClick, sortDirection, sortOrder, sortedColumn } = this.props;
    const headers = [];
    columns.forEach((header, i) => {
      if (!this.widthCache[header]) {
        this.widthCache[header] = new DimensionCache(null, false);
      }

      let columnId;
      let clickableId;
      if (header === ' ') {
        columnId = `list-column-${i}`;
        clickableId = `clickable-list-column-${i}`;
      } else {
        columnId = `list-column-${header.replace(/\s/g, '').toLowerCase()}`;
        clickableId = `clickable-list-column-${header.replace(/\s/g, '').toLowerCase()}`;
      }

      const headerWidth = columnWidths[header];

      let headerStyle;
      if (headerWidth && typeof headerWidth === 'number') {
        headerStyle = { flex: `0 0 ${headerWidth}px` };
      } else {
        headerStyle = { flex: `0 0 ${headerWidth}`, width: `${headerWidth}` };
      }

      const isSortHeader = (sortOrder === header || sortedColumn === header);

      let headerInner;
      if (onHeaderClick) {
        headerInner = (
          <div
            role="button"
            tabIndex="0"
            data-test-clickable-header
            onClick={(e) => { this.handleHeaderClick(e, header); }}
            onKeyPress={(e) => { if (e.keyCode === 32 || e.keyCode === 13) { this.handleHeaderClick(e, header); } }}
            id={clickableId}
          >
            {this.getMappedColumnName(header)}
          </div>
        );
      } else {
        headerInner = this.getMappedColumnName(header);
      }

      headers.push(
        <div
          key={`header-${header}`}
          role="columnheader"
          className={this.getHeaderClassName(header, isSortHeader)}
          aria-sort={isSortHeader ? sortDirection : 'none'}
          style={headerStyle}
          id={columnId}
        >
          <CellMeasurer
            widthCache={this.headerWidths}
            rowIndex={header}
            columnName={header}
            measure={(prevWidth > 0) && !this.headerWidths.request(header)}
          >
            { headerInner }
          </CellMeasurer>
        </div>
      );
    });
    return headers;
  }

  _loadMore(askAmount, index) {
    const { onNeedMoreData } = this.props;
    if (!this.state.loading && onNeedMoreData) {
      onNeedMoreData(askAmount, index);
      this.setState({ loading: true });
      // console.log(`${index} asked for ${askAmount} more`);
    }
  }

  handleLoadMore(askAmount, index) {
    this.debouncedLoadMore(askAmount, index);
  }

  getOuterElementStyle = () => {
    const containerStyle = {
      position: 'relative',
      overflow: 'hidden',
    };

    if (this.props.autosize) {
      containerStyle.height = '100%';
    }

    if (this.props.height) {
      containerStyle.height = this.props.height;
    }

    if (!containerStyle.height) {
      containerStyle.height = 'auto';
    }

    containerStyle.width = this.props.width || '100%';
    return containerStyle;
  };

  getRowContainerStyle = () => {
    const { totalCount, wrapCells, height, minimumRowHeight } = this.props;
    const { receivedRows, rowWidth } = this.state;

    let position = 'relative';
    if (!this.props.virtualize) {
      position = 'static';
    }

    let width = rowWidth || this.props.width || '100%';
    if (wrapCells) width = '100%';

    let newHeight;

    if (totalCount) {
      newHeight = Math.max((totalCount * minimumRowHeight), this.containerHeight || height);
      return { height: `${newHeight}px`, width, position };
    } else {
      newHeight = Math.max((receivedRows * minimumRowHeight), this.containerHeight || height);
      return { height: `${newHeight}px`, width, position };
    }
  }

  setBodyHeight = (cacheResult) => {
    const { result, estimate } = cacheResult;
    if (!estimate || result === 0) {
      return;
    }
    if (this.scrollContainer.current) {
      this.scrollContainer.style.height = result;
    }
  }

  getScrollableStyle = () => {
    const {
      autosize,
      height,
      maxHeight,
      virtualize,
    } = this.props;

    const bodyStyle = {};
    // body will be scrollable if constrained in any way...
    if (autosize || height) {
      bodyStyle.overflow = 'auto';
    }
    // if height is explicit, body height will be the remainder of the container aside from the header
    if (height) {
      bodyStyle.height = height - this.headerHeight;
    }

    if (virtualize) {
      bodyStyle.maxHeight = maxHeight ? maxHeight - this.headerHeight : 'none';
    }

    /* if we've only got a maxHeight to work with, the body max-height property will be set,
    *  this maxHeight is applied to height temporarily. State.bodyHeight will be filled in later
    *  which will set the height for the extent of the data rows;
    */
    if (maxHeight && !height) {
      bodyStyle.maxHeight = maxHeight - this.headerHeight;
      if (this.state.bodyHeight) {
        bodyStyle.height = this.state.bodyHeight;
      } else {
        bodyStyle.height = maxHeight;
      }
    }

    bodyStyle.width = '100%';

    return bodyStyle;
  }

  getHeaderStyle = () => {
    return classnames(
      { [`${css.mclHeaderRow}`]: !this.props.headerRowClass },
      this.props.headerRowClass,
    );
  };

  // the rowcount for accessibility is different from a result count -
  // it's the count of physical rows in the grid, header included.
  getAccessibleRowCount = () => {
    const { totalCount, contentData } = this.props;
    const amount = totalCount || contentData.length;
    if (amount > 0) {
      return amount + 1;
    }
    return amount;
  }

  render() {
    const {
      contentData,
      isEmptyMessage,
      totalCount,
      loading,
    } = this.props;

    // if contentData is empty, render empty message...
    if (contentData.length === 0) {
      return (
        <div
          className={css.mclEmptyMessage}
          style={{ minWidth: this.props.width || '200px' }}
          ref={this.serveContainerRef}
        >
          { typeof isEmptyMessage === 'string' ? <EmptyMessage>{isEmptyMessage}</EmptyMessage> : isEmptyMessage }
        </div>
      );
    }

    return (
      <HotKeys handlers={this.handlers} noWrapper>
        <div
          style={this.getOuterElementStyle()}
          tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
          id={this.props.id}
          ref={this.container}
          role="grid"
          aria-rowcount={this.getAccessibleRowCount()}
          className={css.mclContainer}
          data-total-count={totalCount}
        >
          <div ref={this.headerContainer} className={css.mclHeaderContainer}>
            <div
              className={this.getHeaderStyle()}
              ref={this.headerRow}
              role="row"
              aria-rowindex="1"
            >
              {this.generateHeaders()}
            </div>
          </div>
          <div
            className={css.mclScrollable}
            style={this.getScrollableStyle()}
            onScroll={this.handleScroll}
            ref={this.scrollContainer}
          >
            <div
              className={css.mclRowContainer}
              role="group"
              style={this.getRowContainerStyle()}
              ref={this.rowContainer}
            >
              {this.renderRows()}
            </div>
          </div>
          {
            loading &&
            <div className={css.mclContentLoadingRow}>
              <div className={css.mclContentLoading}>
                <Icon icon="spinner-ellipsis" width="35px" />
              </div>
            </div>
          }
        </div>
      </HotKeys>
    );
  }
}

MCLRenderer.propTypes = propTypes;
MCLRenderer.defaultProps = defaultProps;

export default MCLRenderer;
