/*

** MultiColumnList
  - For displaying tabular data.

  How DOM measuring works within the list:
      Cell-widths are measured first via a CellMeasurer component. These are calculated and compared with
      the width of the headers, greatest one prevailing.
      Next, row heights are measured, and stored in the height cache using the RowMeasurer component.
      Last, rows are positioned absolutely, positions also cached using the RowPositioner component.
*/

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
  forOwn,
  noop,
} from 'lodash';
import memoizeOne from 'memoize-one';

import Icon from '../Icon';
import EmptyMessage from '../EmptyMessage';
import { HotKeys } from '../HotKeys';
import SRStatus from '../SRStatus';
import css from './MCLRenderer.css';
import defaultRowFormatter from './defaultRowFormatter';
import CellMeasurer from './CellMeasurer';
import RowMeasurer from './RowMeasurer';
import LoaderRow from './LoaderRow';
import EndOfList from './EndOfList';
import DimensionCache from './DimensionCache';

import { getNextFocusable } from '../../util/getFocusableElements';
import * as baseHandlers from './defaultHandlers';
import { calculateColumnWidth3q } from './calculateWidth';
import convertToPixels from './convertToPixels';
import RowPositioner from './RowPositioner';
import CenteredContainer from './CenteredContainer';
import PagingButton from './PagingButton';

// used in all margin calculations... static based on CSS value of 15px (gutter-static). (15px * 2 = 30px)
const ROWMARGIN = 30;

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
      obj.forEach(obji => { // eslint-disable-line consistent-return
        const itemIndex = oth.findIndex(i => isEqual(i, obj[obji]));
        if (itemIndex === -1) return false;
      });
    }
    return true;
  }
  return undefined;
}

export function dataChangedOrLess(previous, current) {
  // Filtering... smaller data always a change
  if (current.length < previous.length) return true;

  /* greater data length could be paging... so check to see the data is the same,
  * keeping in mind those array order changes that can happen using the comparison function.
  */
  for (let i = 0; i < previous.length - 1; i += 4) {
    const notEqual = !isEqualWith(previous[i] || {}, current[i], comparison);
    if (notEqual) return true;
  }
  // finally, compare the last item...
  const prevLast = previous.length - 1;
  if (!isEqualWith(current[prevLast], previous[prevLast], comparison)) return true;
  return false;
}

// if no visibleColumns prop is provided, this function is used to generate a columns array for state.
export function initColumnsFromData(item, headerMeta, rowMeta) {
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

function getPixelColumnWidths(columnWidths, width, hasMargin) {
  const columnsFromProps = {};
  // account for margin of rows (30px in CSS... 15 * 2 = 30).
  // this will prevent percentage width that sum to 100% values from exceeding
  // actual width and causing horizontal scroll. - STCOM-633
  const calculatedWidth = width - (hasMargin ? ROWMARGIN : 0);
  forOwn(columnWidths, (value, key) => {
    columnsFromProps[key] = convertToPixels(
      value,
      calculatedWidth,
    );
  });
  return columnsFromProps;
}

function computeRowWidth(columnWidths) {
  return Object.keys(columnWidths)
    .reduce((sum, k) => sum + parseFloat(columnWidths[k], 10), 0);
}

class MCLRenderer extends React.Component {
  static propTypes = {
    autosize: PropTypes.bool,
    columnMapping: PropTypes.object,
    columnOverflow: PropTypes.object,
    columnWidths: PropTypes.object,
    containerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    contentData: PropTypes.arrayOf(PropTypes.object),
    dataEndReached: PropTypes.bool,
    formatter: PropTypes.object,
    getCellClass: PropTypes.func,
    getHeaderCellClass: PropTypes.func,
    hasMargin: PropTypes.bool,
    headerMetadata: PropTypes.object,
    headerRowClass: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
    isSelected: PropTypes.func,
    loading: PropTypes.bool,
    maxHeight: PropTypes.number,
    minimumRowHeight: PropTypes.number,
    nonInteractiveHeaders: PropTypes.arrayOf(PropTypes.string),
    onHeaderClick: PropTypes.func,
    onNeedMoreData: PropTypes.func,
    onRowClick: PropTypes.func,
    onScroll: PropTypes.func,
    pageAmount: PropTypes.number,
    pagingType: PropTypes.oneOf(['scroll', 'click']),
    rowFormatter: PropTypes.func,
    rowMetadata: PropTypes.arrayOf(PropTypes.string),
    rowProps: PropTypes.object,
    rowUpdater: PropTypes.func,
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
  }

  static defaultProps = {
    columnMapping: {},
    columnOverflow: {},
    columnWidths: {},
    contentData: [],
    dataEndReached: false,
    formatter: {},
    hasMargin: false,
    hotKeys: { keyMap: {}, handlers: {} },
    interactive: true,
    isSelected: ({ item, criteria }) => {
      return isEqual(item, criteria);
    },
    isEmptyMessage: <FormattedMessage id="stripes-components.tableEmpty" />,
    nonInteractiveHeaders: [],
    onScroll: noop,
    pageAmount: 30,
    pagingType: 'scroll',
    rowFormatter: defaultRowFormatter,
    rowProps: {},
    rowUpdater: noop,
    scrollToIndex: 0,
    selectedClass: css.mclSelected,
    striped: true,
    totalCount: 0,
    minimumRowHeight: 30.8,
  }

  constructor(props) {
    super(props);

    const { scrollToIndex } = this.props;

    this.rowContainer = React.createRef();
    this.headerRow = React.createRef();
    this.headerContainer = React.createRef();
    this.scrollContainer = React.createRef();
    this.endOfList = React.createRef();
    this.pageButton = React.createRef();
    this.status = React.createRef();

    this.headerHeight = 0;
    this.focusedRowIndex = null;
    this.maximumRowHeight = 30;
    this.keyId = uniqueId('mcl');

    if (typeof props.containerRef === 'function') {
      this.container = (ref) => {
        props.containerRef(ref);
        this.container.current = ref;
      };
    } else {
      this.container = props.containerRef || React.createRef();
    }

    this.memoizedComputeRowWidth = memoizeOne(computeRowWidth);
    this.debouncedLoadMore = debounce(this._loadMore.bind(this), 200, { trailing: true, leading: true });
    this.throttledHandleScroll = throttle(this.handleInfiniteScroll.bind(this), 32);
    this.debouncedHandleResize = debounce(this.handleResize, 100);

    this.state = {
      columns: null,
      receivedRows: 0,
      firstIndex: scrollToIndex,
      scrollTop: 0,
      loading: false,
      columnWidths: {},
      averageRowHeight: 0,
      prevHeight: 0,
      prevWidth: 0,
      maxScrollDelta: 0,
      rowWidth: null,
      staticBody: !props.virtualize,
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

    this.positionCache = new DimensionCache(props.minimumRowHeight, 0, 0);
    this.rowHeightCache = new DimensionCache(props.minimumRowHeight, 0, 0);
    this.headerWidths = new DimensionCache(null);
    this.widthCache = {};
  }

  static getDerivedStateFromProps(props, state) {
    const {
      columns,
      receivedRows,
      prevHeight,
      prevWidth,
    } = state;

    const {
      contentData,
      hasMargin,
      visibleColumns,
      height,
      headerMetadata,
      rowMetadata,
      columnWidths,
      width,
      virtualize,
    } = props;

    const newState = {};

    newState.staticBody = !virtualize;

    // if we just received data for the first time or after reset (no columns)
    if (!columns || (
      visibleColumns &&
      visibleColumns.length > 0 &&
      !isEqual(columns, visibleColumns)
    )) {
      if (visibleColumns) {
        newState.columns = visibleColumns;
      } else if (contentData) {
        newState.columns = initColumnsFromData(contentData[0] || {}, headerMetadata, rowMetadata);
      }
    }

    if (columnWidths && width && width !== state.prevWidth) {
      newState.columnWidths = getPixelColumnWidths(columnWidths, width, hasMargin);
      newState.prevWidth = width;

      const columnVar = columns || newState.columns;
      if (newState.columnWidths &&
        columnVar &&
        (Object.keys(newState.columnWidths).length === columnVar.length)) {
        newState.rowWidth = computeRowWidth(newState.columnWidths);
      }
    }

    // data prop has changed
    if (receivedRows !== contentData.length) {
      newState.receivedRows = contentData.length;
      newState.loading = false;

      if (contentData.length < receivedRows) {
        newState.receivedRows = 0;
        newState.firstIndex = 0;
      }
    }

    if (width && prevWidth !== width) {
      newState.prevWidth = width;
    }

    if (height && prevHeight !== height) {
      newState.prevHeight = height;
    }

    if (Object.keys(newState).length > 0) {
      return newState;
    }
    return null;
  }

  componentDidMount() {
    const {
      contentData,
      width,
    } = this.props;

    window.addEventListener('resize', this.debouncedHandleResize);

    if (contentData.length > 0) {
      this.resetIfGridHidden();

      if (this.headerRow.current) {
        this.headerHeight = this.headerRow.current.offsetHeight;
      }

      let newState = {};
      // if there's no set width prop, column widths should be re-evaluated after mount
      // based on the width of the containing element.
      if (width === undefined) {
        newState = this.getWidthsFromContainer();
      }

      if (this.rowHeightCache.length > 0 && this.state.averageHeight === 0) {
        const avg = this.updateAverageHeight();
        if (avg > 0) {
          newState = Object.assign(newState, { averageRowHeight: avg });
        }
      }

      if (Object.keys(newState).length > 0) {
        this.setState(curState => {
          if (Object.keys(newState.columnWidths).length !== Object.keys(curState.columnWidths).length) {
            newState.columnWidths = Object.assign({}, curState.columnWidths, newState.columnWidths);
          }
          return newState;
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { columnWidths, hasMargin, width, visibleColumns, contentData, pagingType } = this.props;

    let newState = {};

    // if there's no set width prop, column widths should be re-evaluated after mount
    // based on the width of the containing element.
    if (this.props.width === undefined) {
      newState = Object.assign(newState, this.getWidthsFromContainer());
    }

    // data is different, but the length is the same, so reset scroll...(sorting causes this)
    if (dataChangedOrLess(prevProps.contentData, contentData)) {
      this.resetCaches(!!this.props.virtualize);
      this.maximumRowHeight = this.props.minimumRowHeight;
      if (this.scrollContainer.current) {
        this.scrollContainer.current.scrollTop = 0;
      }
      newState.scrollTop = 0;
      newState.columnWidths = {};
      if (columnWidths) {
        const propColumnWidths = getPixelColumnWidths(columnWidths, this.state.prevWidth, hasMargin);
        newState.columnWidths = Object.assign({}, this.state.columnWidths, propColumnWidths);
        if (Object.keys(newState.columnWidths).length === Object.keys(columnWidths).length) {
          newState.rowWidth = computeRowWidth(newState.columnWidths);
        }
      }
      newState.averageRowHeight = 0;
      newState.firstIndex = 0;
    } else if (pagingType === 'click') {
      if (this.focusTargetIndex) {
        const target = document.querySelector(`[data-row-index="row-${this.focusTargetIndex}"]`);
        if (target) {
          const inner = getNextFocusable(target, true, true);
          const elem = inner || target;
          elem.focus();
          this.focusTargetIndex = null;
        }
      }
    }

    if (!isEqual(visibleColumns, prevProps.visibleColumns)) {
      const newBase = this.state.firstIndex;
      const amount = this.positionCache.request(newBase);
      this.positionCache.clearAll();
      this.positionCache.set(newBase, amount);
      this.rowHeightCache.rebase(newBase, amount);
      this.keyId = uniqueId('mcl');
      newState.averageRowHeight = 0;
    }

    if ((prevProps.width !== this.props.width) || (prevProps.height !== this.props.height)) {
      if (prevProps.width || prevProps.height) {
        if (this.positionCache.length > 1) {
          this.focusTarget = this.focusedRowIndex;
          let newBase = this.state.firstIndex;
          // if the focused row is visible, present, establish it as the base.
          if (
            this.focusedRowIndex !== null &&
            this.focusedRowIndex > this.state.firstIndex &&
            this.focusedRowIndex < this.state.firstIndex + this.rowCount
          ) {
            newBase = this.focusedRowIndex;
          }
          const amount = this.positionCache.request(newBase);
          this.positionCache.clearAll();
          this.positionCache.set(newBase, amount);
          this.rowHeightCache.rebase(newBase, amount);
          this.maximumRowHeight = this.props.minimumRowHeight;
          newState.averageRowHeight = 0;
          this.keyId = uniqueId('mcl');
        }
      }
    }

    if (contentData.length > 0) {
      // headerRow height is used to calculate the height of the scrollContainer
      if (this.headerRow.current) {
        this.headerHeight = this.headerRow.current.offsetHeight;
      }

      // update average height if we don't have it...
      if (this.rowHeightCache.length > 0 && this.state.averageHeight === 0) {
        const avg = this.updateAverageHeight();
        if (avg > 0) {
          newState = Object.assign(newState, { averageRowHeight: avg });
        }
      }
    }

    // if props.columnWidths changes...
    if (!isEqual(this.props.columnWidths, prevProps.columnWidths)) {
      this.resetCaches();
      newState.columnWidths = {};
      if (columnWidths) {
        const propColumnWidths = getPixelColumnWidths(
          this.props.columnWidths,
          width || this.state.prevWidth || newState.prevWidth,
          hasMargin
        );
        newState.columnWidths = Object.assign({}, this.state.columnWidths, propColumnWidths);
        if (Object.keys(newState.columnWidths).length === Object.keys(columnWidths).length) {
          newState.rowWidth = computeRowWidth(newState.columnWidths);
        }
      }
      newState.averageRowHeight = 0;
      newState.firstIndex = 0;
    }

    const possibleRowWidth = this.memoizedComputeRowWidth(this.state.columnWidths);
    if (possibleRowWidth !== this.state.rowWidth) {
      newState.rowWidth = possibleRowWidth;
    }

    // only setState in cDU under certain conditions...
    if (Object.keys(newState).length > 0) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState((curState) => {
        // updates to columnWidths from here are all-or-nothing...
        // a new state.columnWidth with fewer keys could possibly keep rows from positioning accurately,
        // so we have to catch the batched updated columnWidths from 'maybeUpdateColumnWidths'
        if (newState.columnWidths && Object.keys(newState.columnWidths).length !== curState.columns.length) {
          newState.columnWidths = Object.assign({}, newState.columnWidths, curState.columnWidths);
        }
        return newState;
      });
    }
  }

  componentWillUnmount() {
    this.debouncedLoadMore.cancel();
    window.removeEventListener('resize', this.debouncedHandleResize);
    this.throttledHandleScroll.cancel();
    this.resetCaches();
  }

  getWidthsFromContainer = () => {
    const { columnWidths, hasMargin } = this.props;
    const newState = {};
    if (this.container.current && this.container.current.parentNode !== null) {
      const containerWidth = this.container.current.offsetWidth;
      // unless the width has changed dramatically, don't update state.
      if (Math.abs(containerWidth - this.state.prevWidth) > 20) {
        newState.prevWidth = containerWidth;
        newState.columnWidths = {};
        if (columnWidths || this.state.columnWidths) {
          // account for existing columnWidths in state...
          const propColumnWidths = getPixelColumnWidths(columnWidths, newState.prevWidth, hasMargin);
          newState.columnWidths = Object.assign({}, this.state.columnWidths, propColumnWidths);
          if (Object.keys(newState.columnWidths).length === this.state.columns.length) {
            newState.rowWidth = computeRowWidth(newState.columnWidths);
          }
        }
      }
    }
    return newState;
  }

  handleResize = () => {
    if (!this.props.width) {
      this.setState({ prevWidth: 0 });
    }
  }

  resetIfGridHidden() {
    if (this.container.current) {
      if (this.container.current.parentNode === null) {
        this.resetCaches();
        return true;
      }
    }
    return false;
  }

  resetCaches = (updateKey = true) => {
    this.rowHeightCache.clearAll();
    this.positionCache.clearAll();
    forOwn(this.widthCache, (value, key) => {
      this.widthCache[key].clearAll();
    });
    // change key so that mounted rows will re-mount.
    if (updateKey) this.keyId = uniqueId('mcl');
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
        const pageButton = this.pageButton.current;
        const newLeft = `${this.scrollContainer.current.scrollLeft}px`;
        if (eOL) {
          eOL.style.left = newLeft;
        }
        if (pageButton) {
          pageButton.style.left = newLeft;
        }
      }
    });

    this.props.onScroll(e);
  }

  handleInfiniteScroll = (currentScroll, currentScrollLeft, index) => {
    const { minimumRowHeight } = this.props;
    const { scrollTop, maxScrollDelta, scrollDirection } = this.state;
    const nextState = {
      scrollTop: currentScroll,
      scrollLeft: currentScrollLeft,
      scrollDirection: scrollTop > currentScroll ? 'up' : 'down'
    };

    let currentScrollDelta = Math.abs(scrollTop - currentScroll);
    // if the same scroll direction, accumulate scrollDirection
    if (nextState.scrolldirection === scrollDirection) {
      if (currentScrollDelta > maxScrollDelta) {
        nextState.maxScrollDelta = currentScrollDelta;
      } else {
        currentScrollDelta = maxScrollDelta;
      }
    } else {
      nextState.scrollDirection = currentScrollDelta;
    }

    if (nextState.scrollDirection === 'down') currentScrollDelta = 0;

    // look before is a minimumRow + a maximumRowHeight before the currentScroll.
    if (!index) {
      let startPosition = currentScroll - (minimumRowHeight + this.maximumRowHeight + currentScrollDelta);
      if (startPosition < 0) startPosition = 0;
      nextState.firstIndex = this.rowHeightCache.getIndexByPosition(startPosition, minimumRowHeight);
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
      e.stopPropagation();
      this.props.onRowClick(e, row);
    }
  };

  handleRowKeyPress = (e, row) => {
    if (!e.target.matches(`.${css.mclRow} *`)) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.handleRowClick(e, row);
      }
    }
  }

  handleRowFocus = (rowIndex) => {
    this.focusedRowIndex = rowIndex;
  }

  handleRowBlur = () => {
    this.focusedRowIndex = null;
  }

  maybeSelected = (criteria, rowIndex) => {
    const { isSelected, contentData } = this.props;
    return isSelected({ item: contentData[rowIndex], rowIndex, criteria });
  };

  onRowPositioned = (cacheResult, rowIndex) => {
    this.stayPositive(cacheResult, rowIndex);
  }

  stayPositive = (cacheResult, rowIndex) => {
    if (cacheResult.result !== 0 && rowIndex === 0) {
      this.positionCache.clearAll();
      this.rowHeightCache.rebase(0, 0);
      this.keyId = uniqueId('mcl');
      this.forceUpdate();
      return true;
    }
    return false;
  }

  setFocusIndex = (index) => {
    this.focusTargetIndex = index;
  }

  sendMessage = (message) => {
    if (this.status.current) {
      this.status.current.sendMessage(message);
    }
  }

  checkForMaxHeight = (cacheResult) => {
    if (cacheResult.result > this.maximumRowHeight) {
      this.maximumRowHeight = cacheResult.result;
    }
  }

  getRowData = (rowIndex) => this.props.contentData[rowIndex];

  renderDataRow = (rowIndex) => {
    const {
      hasMargin,
      id,
      rowProps: pRowProps,
      contentData,
      width,
      rowUpdater,
      columnMapping,
      interactive,
      rowFormatter,
      virtualize,
      selectedRow,
      onRowClick,
    } = this.props;

    const {
      staticBody,
      columns,
      prevWidth,
      columnWidths,
      rowWidth
    } = this.state;

    const widthVar = prevWidth || width || 0;
    const rowWidthVar = rowWidth || 0;

    /* set minWidth of rows to either the width (minus ROWMARGIN to prevent horizontal scroll)
    *  or the rowWidth (sum of the columnWidths)
    *  whichever is greater.
    */
    const defaultStyle = { minWidth: `${Math.max((widthVar - (hasMargin ? ROWMARGIN : 0)), rowWidthVar)}px` };

    const onClick = onRowClick ? (e) => { this.handleRowClick(e, this.getRowData(rowIndex)); } : undefined;
    const onKeyDown = (e) => this.handleRowKeyPress(e, this.getRowData(rowIndex));
    const defaultRowProps = {
      // eslint-disable-next-line
      onClick,
      onKeyDown,
      'style': defaultStyle,
      'data-row-inner' : rowIndex,
    };

    const cellObject = this.renderCells(rowIndex, this.getRowData(rowIndex));

    const rowColumnWidths = this.getColumnWidthsWithUnit();

    const rowClass = this.getRowClass(rowIndex);
    const rowProps = Object.assign(defaultRowProps, pRowProps);
    const injectedRowProps = {
      rowIndex,
      rowClass,
      rowData: contentData[rowIndex],
      rowProps,
      width,
      columnWidths: rowColumnWidths,
      columns,
      columnMapping,
      interactive,
      ...cellObject, // cells, labelStrings
    };

    return (
      /* RowPositioner is a PureComponent - this brings maximum efficiency at the cost of making it aware
        of any side effects that could cause a difference in the rendered output - components/functions
        within formatters that depend on data outside of the contentData itself.
      */
      <RowPositioner
        key={`row-positioner-${rowIndex}-${this.keyId}`}
        gridId={this.props.id}
        rowWidth={this.state.rowWidth}
        positionCache={this.positionCache}
        shouldPosition={!this.state.staticBody}
        onPosition={this.onRowPositioned}
        heightCache={this.rowHeightCache}
        dataItem={contentData[rowIndex]}
        columnCount={columns.length}
        columnWidths={Object.keys(columnWidths).length}
        rowIndex={rowIndex}
        selected={this.maybeSelected(selectedRow, rowIndex)}
        shouldUpdate={rowUpdater(contentData[rowIndex], rowIndex)}
      >
        {({ localRowIndex, position }) => {
          let positionedRowStyle;
          if (position !== null) {
            positionedRowStyle = { top: `${position}px` };
          } else {
            positionedRowStyle = { top: '100%' };
          }
          if (!virtualize) positionedRowStyle = { position: 'static' };
          return (
            <RowMeasurer
              heightCache={this.rowHeightCache}
              gridId={id}
              rowIndex={localRowIndex}
              measure={!staticBody && (columns.length <= Object.keys(columnWidths).length)}
              onMeasure={this.checkForMaxHeight}
              key={`row-measurer-${localRowIndex}-${this.keyId}`}
            >
              <div // eslint-disable-line
                data-row-index={`row-${localRowIndex}`}
                className={css.mclRowFormatterContainer}
                aria-rowindex={localRowIndex + 2}
                onClick={onRowClick ? this.handleRowClick : undefined}
                onFocus={this.handleRowFocus}
                onBlur={this.handleRowBlur}
                style={positionedRowStyle}
                role="row"
              >
                {rowFormatter(injectedRowProps)}
              </div>
            </RowMeasurer>
          );
        }}
      </RowPositioner>
    );
  }

  renderLoaderRow = (rowIndex, dataRowsRendered, heightIncrement) => {
    const {
      contentData,
      totalCount,
      pageAmount,
    } = this.props;

    const {
      columns,
      columnWidths,
      firstIndex,
      rowWidth,
      staticBody,
    } = this.state;

    const loaderClassname = `${css.mclRow} ${rowIndex % 2 !== 0 ? '' : css.mclIsOdd}`;
    // if an onNeedMoreData callback is present, render at least one loader...
    // the single loader is visibly hidden.
    if (totalCount === 0) {
      // no totalCount means it's up to the position in the data to decide to load more...
      if (contentData.length - (firstIndex + dataRowsRendered) < pageAmount) {
        return (
          <LoaderRow
            key={`loader-row-${rowIndex}-${this.keyId}`}
            askAmount={pageAmount}
            height={0}
            rowIndex={rowIndex}
            aria-rowindex={rowIndex + 2}
            loadMore={this.handleLoadMore}
            className={loaderClassname}
            columns={columns}
            columnWidths={columnWidths}
          />
        );
      }
    }
    // totalCount allows the grid to render placeholders for not-yet-loaded rows...
    return (
      <RowPositioner
        key={`row-loader-positioner-${rowIndex}-${this.keyId}`}
        gridId={this.props.id}
        shouldPosition={!staticBody}
        onPosition={this.onRowPositioned}
        heightCache={this.rowHeightCache}
        positionCache={this.positionCache}
        columnCount={columns.length}
        columnWidths={Object.keys(columnWidths).length}
        averageHeight={heightIncrement}
        rowIndex={rowIndex}
      >
        { /*  rowIndex passed through to children as localRowIndex since
              the outer scope rowIndex changes */
          ({ localRowIndex, position }) => (
            <LoaderRow
              key={`loader-row-${localRowIndex}-${this.keyId}`}
              askAmount={Math.min(pageAmount, totalCount - contentData.length)}
              height={heightIncrement}
              minWidth={rowWidth}
              rowIndex={localRowIndex}
              loadMore={this.handleLoadMore}
              className={loaderClassname}
              columns={columns}
              styleTop={position}
              columnWidths={columnWidths}
            />
          )
        }
      </RowPositioner>
    );
  };

  renderEndOfList = (endIndex, renderPosition) => {
    const {
      dataEndReached,
      id,
      virtualize,
      totalCount,
      width,
    } = this.props;

    const {
      prevWidth,
      staticBody
    } = this.state;

    return (
      <RowPositioner
        key={`end-of-list-positioner-${renderPosition}-${this.keyId}`}
        gridId={id}
        heightCache={this.rowHeightCache}
        positionCache={this.positionCache}
        onPosition={this.updateBodyHeight}
        shouldPosition={!staticBody}
        rowIndex={endIndex}
      >
        { ({ position }) => {
          return (
            <div data-end-of-list={endIndex} className={css.mclEndOfListContainer} style={{ top: `${position}px` }}>
              <CenteredContainer
                width={width || prevWidth || undefined}
                innerRef={this.endOfList}
                visible={virtualize && (dataEndReached || (totalCount > 0 && totalCount <= renderPosition))}
              >
                <EndOfList />
              </CenteredContainer>
            </div>
          );
        }}
      </RowPositioner>
    );
  }

  renderPagingButton = (rowIndex) => {
    const {
      dataEndReached,
      id,
      width,
      pageAmount
    } = this.props;

    const {
      prevWidth,
      loading,
      staticBody,
    } = this.state;

    if (dataEndReached) { return null; }

    return (
      <RowPositioner
        key={`load-button-positioner-${rowIndex}-${this.keyId}`}
        gridId={id}
        heightCache={this.rowHeightCache}
        positionCache={this.positionCache}
        shouldPosition={!staticBody}
        rowIndex={rowIndex}
      >
        {({ localRowIndex, position }) => (
          <div
            key={`${localRowIndex}-load-button`}
            style={{ position: 'absolute', top: `${position}px`, marginTop: '1rem' }}
          >
            <CenteredContainer
              width={width || prevWidth || undefined}
              innerRef={this.pageButton}
              visible
            >
              <FormattedMessage id="stripes-components.mcl.itemsRequestedMessage">
                { message => (
                  <PagingButton
                    rowIndex={rowIndex}
                    onClick={() => {
                      this.setFocusIndex(rowIndex);
                      this.handleLoadMore(pageAmount, rowIndex);
                    }}
                    sendMessage={this.sendMessage}
                    loadingMessage={message}
                    loading={loading}
                    gridId={id || this.keyId}
                  />
                )}
              </FormattedMessage>
            </CenteredContainer>
          </div>
        )}
      </RowPositioner>
    );
  }

  renderRows = () => {
    const {
      minimumRowHeight,
      maxHeight,
      contentData,
      pagingType,
      totalCount,
      virtualize,
      onNeedMoreData,
    } = this.props;

    const {
      firstIndex,
      scrollTop,
      averageRowHeight,
      maxScrollDelta,
      scrollDirection,
      prevHeight,
    } = this.state;

    this.framePositions = {};
    const rows = [];

    const scrollRange = scrollDirection === 'down' ? maxScrollDelta : 0;

    let bodyExtent;
    const bodyHeight = prevHeight || maxHeight;
    const heightIncrement = averageRowHeight || minimumRowHeight;
    if (virtualize && bodyHeight) {
      bodyExtent = bodyHeight * 2 + scrollTop;
    } else {
      bodyExtent = contentData.length * heightIncrement;
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

    let dataRowsRendered = firstIndex;
    let renderPosition = firstIndex;

    this.rowHeightCache.fillerItem = heightIncrement;

    for (
      let rowIndex = firstIndex;
      ((currentTop <= bodyExtent) && (virtualize && totalCount ? rowIndex < totalCount : true));
      currentTop += minimumRowHeight, rowIndex += 1, renderPosition += 1
    ) {
      if (contentData[rowIndex] && rowIndex < contentData.length) {
        rows.push(this.renderDataRow(rowIndex));
        dataRowsRendered += 1;
      } else if (loaderSettings.load && (totalCount === 0 || rowIndex < totalCount)) {
        if (totalCount === 0) {
          currentTop = bodyExtent;
        }
        if (pagingType === 'scroll') {
          rows.push(this.renderLoaderRow(rowIndex, dataRowsRendered, heightIncrement));
        } else if (pagingType === 'click') {
          currentTop = bodyExtent;
          rows.push(this.renderPagingButton(rowIndex));
        }
      }
    }

    const endIndex = onNeedMoreData ? renderPosition : dataRowsRendered;
    // keep a count of the amount of rows rendered in the view.
    this.rowCount = endIndex - firstIndex;
    rows.push(this.renderEndOfList(endIndex, renderPosition));

    return rows;
  }

  renderCells = (rowIndex, rowData) => {
    const { formatter, contentData, columnOverflow, id, columnWidths: columnWidthsProp, getCellClass } = this.props;
    const { columnWidths, columns } = this.state;
    const cells = [];
    const labelStrings = [];

    columns.forEach((col) => {
      let value;
      let stringValue;

      const cellStyleClass = typeof getCellClass === 'function' ? getCellClass(css.mclCellStyle, rowData, col) : css.mclCellStyle;

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
      if (columnWidths[col]) {
        cellStyle = { width: this.state.columnWidths[col] };
      }

      const showOverflow = (columnOverflow[col]) ? css.mclShowOverflow : '';
      const colWidthsVar = columnWidths[col] || columnWidthsProp[col];
      const shouldMeasure = (!columnWidths || !colWidthsVar);

      cells.push((
        <CellMeasurer
          widthCache={this.widthCache[col]}
          gridId={id}
          rowIndex={rowIndex}
          columnName={col}
          shouldMeasure={shouldMeasure}
          onMeasure={this.maybeUpdateColumnWidths}
          key={`cell-${col}-row-${rowIndex}-${this.keyId}`}
        >
          <div
            role="gridcell"
            key={`${col}-${rowIndex}-${this.keyId}`}
            className={`${css.mclCell} ${showOverflow} ${cellStyleClass}`}
            style={cellStyle}
          >
            {value}
          </div>
        </CellMeasurer>
      ));

      labelStrings.push(`${this.getMappedColumnName(col)}: ${stringValue}`);
    });

    return { cells, labelStrings };
  }

  // Column Logic
  // eslint-disable-next-line no-unused-vars
  maybeUpdateColumnWidths = (rowIndex, columnName, width) => {
    const { columnWidths: columnWidthsState, prevHeight } = this.state;
    const { contentData, minimumRowHeight } = this.props;
    const minHeightSample = prevHeight > 0 ? prevHeight / minimumRowHeight : 15;
    const sample = Math.min(contentData.length, minHeightSample);
    if (!this.calculatedColumns) this.calculatedColumns = {};
    if (this.widthCache[columnName].length >= sample &&
      !columnWidthsState[columnName] &&
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
        newState.rowWidth = computeRowWidth(newState.columnWidths);
        return newState;
      }, () => {
        this.calculatedColumns = {};
      });
    }
  }

  getColumnWidthsWithUnit = () => {
    const { columnWidths } = this.state;
    const widths = {};
    forOwn(columnWidths, (value, key) => {
      widths[key] = `${value}px`;
    });
    return widths;
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

  getHeaderClassName = (column, sortedBy, isInteractive) => {
    return classnames(
      css.mclHeader,
      { [`${css.mclClickable}`]: isInteractive },
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

  renderHeaders = () => {
    const { columnWidths, columns } = this.state;
    const {
      getHeaderCellClass,
      onHeaderClick,
      nonInteractiveHeaders,
      sortDirection,
      sortOrder,
      sortedColumn,
      id,
      columnWidths: columnWidthsProp
    } = this.props;
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

      const defaultHeaderCellClass = this.getHeaderClassName(header, isSortHeader, isInteractive);

      let headerStyle;
      let headerCellClass;

      if (headerWidth) {
        headerStyle = { flex: `0 0 ${headerWidth}px`, width: `${headerWidth}px` };
        headerCellClass = typeof getHeaderCellClass === 'function' ?
          getHeaderCellClass(defaultHeaderCellClass, header) : defaultHeaderCellClass;
      } else {
        headerStyle = { flex: '0 0 auto' };
        headerCellClass = defaultHeaderCellClass;
      }

      const isSortHeader = (sortOrder === header || sortedColumn === header);
      const isInteractive = onHeaderClick && !nonInteractiveHeaders.includes(header);

      let headerInner;
      if (isInteractive) {
        headerInner = (
          <div
            role="button"
            tabIndex="0"
            className={css.mclHeaderOuter}
            data-test-clickable-header
            onClick={(e) => { this.handleHeaderClick(e, header); }}
            onKeyPress={(e) => { if (e.keyCode === 32 || e.keyCode === 13) { this.handleHeaderClick(e, header); } }}
            id={clickableId}
          >
            <div className={css.mclHeaderInner}>
              <div style={{ flex: '0 100 content', maxWidth: 'calc(100%-15px)' }}>
                {this.getMappedColumnName(header)}
              </div>
            </div>
          </div>
        );
      } else {
        headerInner = this.getMappedColumnName(header);
      }

      const shouldMeasure = (!columnWidthsProp[header] && this.headerWidths.request(header) === null);

      headers.push(
        <CellMeasurer
          key={`header-${header}`}
          widthCache={this.headerWidths}
          gridId={id}
          rowIndex={header}
          columnName={header}
          shouldMeasure={shouldMeasure}
        >
          <div
            role="columnheader"
            className={headerCellClass}
            aria-sort={isSortHeader ? sortDirection : 'none'}
            style={headerStyle}
            id={columnId}
          >
            { headerInner }
          </div>
        </CellMeasurer>
      );
    });
    return headers;
  }

  _loadMore(askAmount, index) {
    const { onNeedMoreData } = this.props;
    if (!this.state.loading && onNeedMoreData) {
      onNeedMoreData(askAmount, index);
      this.setState({ loading: true });
    }
  }

  handleLoadMore = (askAmount, index) => {
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

  updateBodyHeight = (cacheResult) => {
    const { result } = cacheResult;
    const { bodyHeight } = this.state;
    const scrollBarHeight = 20;
    if (result && bodyHeight !== result + scrollBarHeight) {
      this.setState(() => ({
        bodyHeight: result + scrollBarHeight
      }));
    }
  }

  getRowContainerStyle = () => {
    const { totalCount, wrapCells, height, minimumRowHeight, virtualize, pagingType } = this.props;
    const { receivedRows, rowWidth, averageRowHeight } = this.state;

    let position = 'static';
    if (this.props.virtualize) {
      position = 'relative';
    }

    let width = rowWidth || this.props.width || '100%';
    if (wrapCells) width = '100%';

    let newHeight;

    /* if the height prop is not defined, the size of the physical container is ever-growing
    *  with the size of the contentData.
    */
    if (height !== undefined) {
      // if we have a totalCount, we can set size based on that... if not, the receivedRows count.
      const scrollBarHeight = 20;
      newHeight = Math.max(
        ((pagingType === 'click' ? receivedRows : totalCount || receivedRows) * minimumRowHeight),
        (height - this.headerHeight - scrollBarHeight)
      );
      return { height: `${newHeight}px`, width, position };
    } else if (virtualize) {
      newHeight = receivedRows * averageRowHeight;
      return { height: `${newHeight}px`, width, position };
    }
    return { position };
  }

  getScrollableStyle = () => {
    const {
      height,
      maxHeight,
    } = this.props;

    const { bodyHeight, prevHeight } = this.state;

    const scrollableStyle = {
      position: 'static'
    };

    const heightVar = height || prevHeight;

    // body will be scrollable if a physical height limit is applied...
    if (heightVar || maxHeight) {
      scrollableStyle.overflow = 'auto';
    }

    /* State.bodyHeight will be filled in later if it isn't already...
    *  which will set the height for the extent of the data rows;
    */

    // maxHeight will use bodyHeight if bodyHeight is less...
    if (bodyHeight && maxHeight) {
      scrollableStyle.height = Math.min(bodyHeight, maxHeight - this.headerHeight);
    } else if (heightVar > 0) { // if we've got a positive height prop, use it...
      scrollableStyle.height = heightVar - this.headerHeight;
    }

    // avoid setting a 0px height
    if (scrollableStyle.height === 0) {
      delete scrollableStyle.height;
    }

    // set maxHeight if we've got it...
    if (maxHeight) {
      scrollableStyle.maxHeight = maxHeight - this.headerHeight;
    }

    scrollableStyle.width = '100%';

    return scrollableStyle;
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
      hasMargin,
    } = this.props;

    // if grid is hidden, (containing elements set to display: none) return null.
    if (this.resetIfGridHidden()) {
      return null;
    }

    // if contentData is empty, render empty message...
    if (contentData.length === 0) {
      return (
        <div
          className={css.mclEmptyMessage}
          style={{ minWidth: this.props.width || '200px' }}
          ref={this.container}
        >
          { typeof isEmptyMessage === 'string' ? <EmptyMessage>{isEmptyMessage}</EmptyMessage> : isEmptyMessage }
        </div>
      );
    }

    const renderedHeaders = this.renderHeaders();
    const renderedRows = this.renderRows();

    return (
      <HotKeys handlers={this.handlers} noWrapper>
        <SRStatus ref={this.status} />
        <div
          style={this.getOuterElementStyle()}
          tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
          id={this.props.id}
          ref={this.container}
          role="grid"
          aria-rowcount={this.getAccessibleRowCount()}
          className={classnames(css.mclContainer, { [css.hasMargin]: hasMargin })}
          data-total-count={totalCount}
        >
          <div ref={this.headerContainer} className={css.mclHeaderContainer}>
            <div
              className={this.getHeaderStyle()}
              style={{ display: 'flex' }}
              ref={this.headerRow}
              role="row"
              aria-rowindex="1"
            >
              {renderedHeaders}
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
              role="rowgroup"
              style={this.getRowContainerStyle()}
              ref={this.rowContainer}
            >
              {renderedRows}
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

export default MCLRenderer;
