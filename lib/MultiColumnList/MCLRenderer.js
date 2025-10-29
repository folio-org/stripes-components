import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import classnames from 'classnames';
import {
  isEmpty,
  isEqual,
  isEqualWith,
  debounce,
  throttle,
  uniqueId,
  forOwn,
  noop,
  get,
  isNil,
} from 'lodash';
import memoizeOne from 'memoize-one';

import Icon from '../Icon';
import EmptyMessage from '../EmptyMessage';
import StripesOverlayWrapper from '../../util/StripesOverlayWrapper';
import { HotKeys } from '../HotKeys';
import SRStatus from '../SRStatus';
import css from './MCLRenderer.css';
import defaultRowFormatter from './defaultRowFormatter';
import CellMeasurer from './CellMeasurer';
import RowMeasurer from './RowMeasurer';
import LoaderRow from './LoaderRow';
import EndOfList from './EndOfList';
import DimensionCache from './DimensionCache';

import { getNextFocusable, FOCUSABLE_SELECTOR } from '../../util/getFocusableElements';
import * as baseHandlers from './defaultHandlers';
import { calculateColumnWidth3q } from './calculateWidth';
import convertToPixels from './convertToPixels';
import RowPositioner from './RowPositioner';
import CenteredContainer from './CenteredContainer';
import LoadMorePaginationRow from './LoadMorePaginationRow';
import PrevNextPaginationRow from './PrevNextPaginationRow';

/* MultiColumnList
  - For displaying tabular data.

  How DOM measuring works within the list:
      Cell-widths are measured first via a CellMeasurer component. These are calculated and compared with
      the width of the headers, greatest one prevailing.
      Next, row heights are measured, and stored in the height cache using the RowMeasurer component.
      Last, rows are positioned absolutely, positions also cached using the RowPositioner component.
*/

// used in all margin calculations... static based on CSS value of 15px (gutter-static). (15px * 2 = 30px)
const ROWMARGIN = 30;
const CHANGE_NEWDATA = 'new data';
const CHANGE_LESSDATA = 'less';
const CHANGE_DIFFERENCE = 'difference';

// width of scrollbar in pixels. the width depends on user's OS and browser
// 2018 article on different scroll widths https://codepen.io/sambible/post/browser-scrollbar-widths
// online tool that will tell you your scrollbar width https://adminhacks.com/scrollbar-size/
const SCROLLBAR_WIDTH = 17;

/* some item fields will have arrays... those don't always come back in the same
*  order, despite the item being the same. This function checks for equality with that in mind.
*/
function comparison(obj, oth) {
  if (obj === oth) return true;
  // if (obj === undefined || oth === undefined) return true;
  const objType = typeof obj;
  const othType = typeof oth;
  if (objType !== othType) return false;
  const objIsArray = Array.isArray(obj);
  const othIsArray = Array.isArray(oth);
  if (objIsArray && othIsArray) {
    if (obj.length !== oth.length) return false;
    if (obj.length > 0) {
      for (let obji = 0; obji < obj.length; obji++) {
        const itemIndex = oth.findIndex(i => isEqual(i, obj[obji]));
        if (itemIndex === -1) return false;
      }
      // obj.forEach(obji => { // eslint-disable-line consistent-return
      //   const itemIndex = oth.findIndex(i => isEqual(i, obj[obji]));
      //   if (itemIndex === -1) return false;
      // });
    }
    return true;
  }
  return undefined;
}

export function dataChangedOrLess(previous, current) {
  // compare Object.keys for sparse array structures.
  const currentKeys = Object.keys(current);
  const previousKeys = Object.keys(previous);

  if (currentKeys.length < previousKeys.length) {
    return { changed: true, changeType: CHANGE_LESSDATA, populatedLength: current.length };
  }

  /* greater data length could be paging... so check to see the data is the same,
  * keeping in mind those array order changes that can happen using the comparison function.
  */
  // find a suitable interval...
  const interval = Math.min(4, Math.ceil(previous.length / 6));
  for (let i = Number.parseInt(previousKeys[0], 10); i <
    Number.parseInt(previousKeys[previousKeys.length - 1], 10);
    i += interval) {
    const notEqual = !isEqualWith(previous[i] || {}, current[i] || {}, comparison);
    if (notEqual) {
      return {
        changed: true,
        changeType: !previous[i] ? CHANGE_NEWDATA : CHANGE_DIFFERENCE,
        datalength: currentKeys.length,
      };
    }
  }

  // finally, compare the last item...
  const prevLast = previous.length - 1;
  if (!isEqualWith(current[prevLast], previous[prevLast], comparison)) {
    return {
      changed: true,
      changeType: previous[prevLast] === null ? CHANGE_NEWDATA : CHANGE_DIFFERENCE,
      datalength: currentKeys.length,
    };
  }
  return { changed: false, changeType: null, datalength: currentKeys.length };
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
    if (typeof value !== 'object') {
      columnsFromProps[key] = convertToPixels(
        value,
        calculatedWidth,
      );
    }
  });
  return columnsFromProps;
}

function computeRowWidth(columnWidths, columns) {
  return Object.keys(columnWidths)
    .reduce((sum, k) => {
      const rowWidth = columns.includes(k) ? sum + parseFloat(columnWidths[k], 10) :
        sum;
      return rowWidth;
    }, 0);
}

export const hasVerticalScrollbar = (el) => el.clientHeight < el.scrollHeight;

export const pagingTypes = {
  LOAD_MORE: 'click',
  NONE: 'none',
  PREV_NEXT: 'prev-next',
  SCROLL: 'scroll'
};

// we only need a tab-index on the scrollcontainer if there are no other
// focusable elements within it.
function getScrollableTabIndex(scrollContainer) {
  if (scrollContainer.current) {
    const focusable = scrollContainer.current.querySelector(FOCUSABLE_SELECTOR);
    if (focusable) {
      return {};
    }
  }
  return { tabIndex: '0' }
}

class MCLRenderer extends React.Component {
  static propTypes = {
    autosize: PropTypes.bool,
    columnIdPrefix: PropTypes.string,
    columnMapping: PropTypes.object,
    columnOverflow: PropTypes.object,
    columnWidths: PropTypes.object,
    containerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    contentData: PropTypes.arrayOf(PropTypes.object),
    dataEndReached: PropTypes.bool,
    dndProvided: PropTypes.shape({
      placeholder: PropTypes.node,
    }),
    formatter: PropTypes.object,
    getCellClass: PropTypes.func,
    getHeaderCellClass: PropTypes.func,
    getRowContainerClass: PropTypes.func,
    hasMargin: PropTypes.bool,
    headerMetadata: PropTypes.object,
    headerRowClass: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    hidePageIndices: PropTypes.bool,
    hotKeys: PropTypes.object,
    id: PropTypes.string,
    instanceRef: PropTypes.func,
    interactive: PropTypes.bool,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func
    }),
    isEmptyMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.node,
      PropTypes.arrayOf([PropTypes.node]),
    ]),
    isSelected: PropTypes.func,
    itemToView: PropTypes.shape({
      localClientTop: PropTypes.number,
      selector: PropTypes.string,
    }),
    loading: PropTypes.bool,
    maxHeight: PropTypes.number,
    minimumRowHeight: PropTypes.number,
    nonInteractiveHeaders: PropTypes.arrayOf(PropTypes.string),
    onHeaderClick: PropTypes.func,
    onMarkPosition: PropTypes.func,
    onMarkReset: PropTypes.func,
    onNeedMoreData: PropTypes.func,
    onRowClick: PropTypes.func,
    onScroll: PropTypes.func,
    pageAmount: PropTypes.number,
    pagingButtonLabel: PropTypes.node,
    pagingCanGoNext: PropTypes.bool,
    pagingCanGoNextLoading: PropTypes.bool,
    pagingCanGoPrevious: PropTypes.bool,
    pagingCanGoPreviousLoading: PropTypes.bool,
    pagingOffset: PropTypes.number,
    pagingType: PropTypes.oneOf(Object.values(pagingTypes)),
    rowFormatter: PropTypes.func,
    rowMetadata: PropTypes.arrayOf(PropTypes.string),
    rowProps: PropTypes.object,
    rowUpdater: PropTypes.func,
    scrollToIndex: PropTypes.number,
    selectedClass: PropTypes.string,
    selectedRow: PropTypes.object,
    showSortIndicator: PropTypes.bool,
    sortableFields: PropTypes.arrayOf(PropTypes.string),
    sortDirection: PropTypes.oneOf(['ascending', 'descending']),
    sortedColumn: PropTypes.string,
    sortOrder: PropTypes.string,
    stickyFirstColumn: PropTypes.bool,
    stickyLastColumn: PropTypes.bool,
    striped: PropTypes.bool,
    totalCount: PropTypes.number,
    virtualize: PropTypes.bool,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
    width: PropTypes.number,
    wrapCells: PropTypes.bool,
  }

  static defaultProps = {
    pagingCanGoNext: null,
    pagingCanGoNextLoading: null,
    pagingCanGoPrevious: null,
    pagingCanGoPreviousLoading: null,
    columnMapping: {},
    columnOverflow: {},
    columnWidths: {},
    contentData: [],
    dataEndReached: false,
    dndProvided: {},
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
    pagingButtonLabel: <FormattedMessage id="stripes-components.mcl.loadMore" />,
    pagingType: 'scroll',
    rowFormatter: defaultRowFormatter,
    rowProps: {},
    rowUpdater: noop,
    scrollToIndex: 0,
    selectedClass: css.mclSelected,
    showSortIndicator: false,
    sortableFields: [],
    striped: true,
    totalCount: 0,
    minimumRowHeight: 30.8,
  }

  constructor(props) {
    super(props);

    this.rowContainer = React.createRef();
    this.headerRow = React.createRef();
    this.paginationContainer = React.createRef();
    this.headerContainer = React.createRef();
    this.scrollContainer = React.createRef();
    this.endOfList = React.createRef();
    this.pageButton = React.createRef();
    this.status = React.createRef();
    this.shortcutsRef = React.createRef();

    this.headerHeight = 0;
    this.paginationHeight = 40;
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
      firstIndex: 0,
      scrollTop: 0,
      loading: false,
      columnWidths: {},
      averageRowHeight: 0,
      prevHeight: 0,
      prevWidth: 0,
      maxScrollDelta: 0,
      rowWidth: null,
      staticBody: !props.virtualize,
      prevDataLength: 0,
      modColumns: [],
      isSparse: false,
      hasScrollbar: false,
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
    this.itemToViewIsStale = false;
    this.prevVScroll = 0;
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

    if (columnWidths) {
      newState.modColumns = [];
      Object.keys(columnWidths).forEach((w) => {
        if (typeof columnWidths[w] === 'object') {
          newState.modColumns.push(w);
        }
      });
    }

    if (columnWidths && width && width !== state.prevWidth) {
      newState.columnWidths = getPixelColumnWidths(columnWidths, width, hasMargin);
      newState.prevWidth = width;

      const columnVar = columns || newState.columns;
      if (newState.columnWidths &&
        columnVar &&
        (Object.keys(newState.columnWidths).length === columnVar.length)) {
        newState.rowWidth = computeRowWidth(newState.columnWidths, newState.columns ?? columns);
      }
    }

    // data prop has changed
    if (contentData && contentData.length !== 0) {
      const dataKeys = Object.keys(contentData);
      newState.dataStartIndex = Number.parseInt(dataKeys[0], 10);
      newState.dataEndIndex = Number.parseInt(dataKeys[dataKeys.length - 1], 10);
      if (dataKeys.length !== contentData.length) {
        newState.isSparse = true;
      }
    }

    const checkValue = Number.parseInt(Object.keys(contentData).length, 10);

    if (receivedRows !== checkValue) {
      newState.receivedRows = checkValue;
      newState.loading = false;
    }

    if (newState.isSparse && receivedRows !== checkValue) {
      // for paging via slice-at-a-time sparse arrays (and prev/next pagination);
      if (!virtualize) {
        const contentDataIndices = Object.keys(contentData);
        newState.firstIndex = Number.parseInt(contentDataIndices[0], 10) || 0;
        newState.lastIndex = Number.parseInt(contentDataIndices[contentDataIndices.length - 1], 10) || 0;
        newState.receivedRows = 0;
      } else if (checkValue < receivedRows) {
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

      if (this.rowHeightCache.length > 0 && this.state.averageRowHeight === 0) {
        const avg = this.updateAverageHeight();
        if (avg > 0) {
          newState = Object.assign(newState, { averageRowHeight: avg });
        }
      }

      newState.hasScrollbar = this.scrollContainer.current ? hasVerticalScrollbar(this.scrollContainer.current) : false;

      if (Object.keys(newState).length > 0) {
        this.setState(curState => {
          if (newState.columnWidths &&
            Object.keys(newState.columnWidths).length !== Object.keys(curState.columnWidths).length) {
            newState.columnWidths = Object.assign({}, curState.columnWidths, newState.columnWidths);
          }
          return newState;
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { columnWidths, hasMargin, width, visibleColumns, contentData, pagingType, virtualize } = this.props;
    const { columns, isSparse, columnWidths: stateColumnWidths, hasScrollbar: stateHasScrollbar, loading } = this.state;

    let newState = {};
    let widthsToClear = [];

    // More results got loaded
    if (prevProps.contentData.length && this.props.contentData.length > prevProps.contentData.length) {
      this.handleMoreResultsLoaded();
    }

    // if there's no set width prop, column widths should be re-evaluated after mount
    // based on the width of the containing element.
    if (this.props.width === undefined) {
      newState = Object.assign(newState, this.getWidthsFromContainer());
    }

    // detect if data has changed...
    // dChOL returns an object in the shape of {changed: bool, changeType: string | null}
    // the changeType could be "difference", "length", "new data", "none".
    const shouldUpdate = dataChangedOrLess(prevProps.contentData, contentData);
    if (shouldUpdate.changed && shouldUpdate.changeType !== CHANGE_NEWDATA) {
      this.resetCaches(!!this.props.virtualize);
      this.maximumRowHeight = this.props.minimumRowHeight;
      // newState.loadedEstimate = shouldUpdate.datalength;

      newState.hasScrollbar = this.scrollContainer.current ? hasVerticalScrollbar(this.scrollContainer.current) : false;

      // only scroll to top for sorting (all current data is non-null and the length is the same)
      if (shouldUpdate.changeType === CHANGE_DIFFERENCE || shouldUpdate.changeType === CHANGE_LESSDATA) {
        if (this.scrollContainer.current) {
          this.scrollContainer.current.scrollTop = 0;
        }
        newState.scrollTop = 0;
      }
      newState.columnWidths = {};
      if (columnWidths) {
        const propColumnWidths = getPixelColumnWidths(columnWidths, this.state.prevWidth, hasMargin);
        newState.columnWidths = Object.assign({}, this.state.columnWidths, propColumnWidths);
        if (Object.keys(newState.columnWidths).length === Object.keys(columnWidths).length) {
          newState.rowWidth = computeRowWidth(newState.columnWidths, columns ?? visibleColumns);
        }
      }

      newState.averageRowHeight = 0;
      if (!isSparse) {
        newState.firstIndex = 0;
        // if the data has changed, new data has loaded, so we go ahead and set loading to false.
        newState.loading = false;
      } else {
        newState.firstIndex = Number.parseInt(Object.keys(contentData)[0], 10) || 0;
        newState.loading = false;
      }
    } else if (pagingType === pagingTypes.LOAD_MORE || pagingType === pagingTypes.PREV_NEXT) {
      // this.focusTargetIndex can be 0, so we need to check for undefined
      // When `isSparse` is false, focus happens more than once and `handleRowFocus` fires multiple times,
      // so we need to check for `null` as well.
      // We wait for the loading to complete so that to have the correct `isSparse` state, since empty items are only
      // added to the `contentData` array after new data has been loaded, which is how it works in stripes-connect.
      // E.g. when we go from the first page to the second, `isSparse` will be false during loading,
      // because dataKeys.length === contentData.length.
      if (!isNil(this.focusTargetIndex) && !loading) {
        const { current } = this.scrollContainer;
        // When array is sparse focus index starts with this.focusTargetIndex
        // When array is non-sparse, set focusIndex to 0
        const targetIndex = isSparse ? this.focusTargetIndex : 0;
        const target = current?.querySelector(`[data-row-index="row-${targetIndex}"]`);

        if (target) {
          const inner = getNextFocusable(target, true, true);
          const elem = inner || target;
          elem.focus();
          this.focusTargetIndex = null;
        }
      }
    } else if (prevProps.contentData.length < contentData.length) {
      newState.prevDataLength = prevProps.contentData.length;
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

    // changes in grid dimensions
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

      if (contentData.length !== 0 &&
        !virtualize) {
        this.itemToViewIsStale = false
      }
    }

    if (contentData.length > 0) {
      // headerRow height is used to calculate the height of the scrollContainer
      if (this.headerRow.current) {
        this.headerHeight = this.headerRow.current.offsetHeight;
      }

      if (this.paginationContainer.current) {
        this.paginationHeight = this.paginationContainer.current.offsetHeight;
      }

      // update average height if we don't have it...
      if (this.rowHeightCache.length > 0 && this.state.averageRowHeight === 0) {
        const avg = this.updateAverageHeight();
        if (avg > 0) {
          newState = Object.assign(newState, { averageRowHeight: avg });
        }
      }

      // update header row and check for vertical scrollbar...
      const rowElem = this.rowContainer.current.querySelector(`.${css.mclRow}`);
      if (rowElem) {
        this.headerRow.current.style.width = `${rowElem.offsetWidth + SCROLLBAR_WIDTH}px`;
        const hasScrollbar = this.scrollContainer.current ?
          hasVerticalScrollbar(this.scrollContainer.current) :
          false;
        if (hasScrollbar !== stateHasScrollbar) {
          newState.hasScrollbar = hasScrollbar;
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
        if (!isEmpty(propColumnWidths)) {
          newState.columnWidths = Object.assign({}, this.state.columnWidths, propColumnWidths);
        } else {
          newState.columnWidths = this.state.columnWidths;
          widthsToClear = Object.keys(this.props.columnWidths);
        }
        if (Object.keys(newState.columnWidths).length === Object.keys(columnWidths).length) {
          newState.rowWidth = computeRowWidth(newState.columnWidths, columns);
        }
      }
      newState.averageRowHeight = 0;
      newState.firstIndex = 0;
    }

    const possibleRowWidth = this.memoizedComputeRowWidth(this.state.columnWidths, columns);
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
        if (widthsToClear) {
          widthsToClear.forEach(w => {
            delete newState.columnWidths[w];
          });
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

  getCanGoNext = () => {
    const {
      pagingCanGoNext,
      pagingCanGoNextLoading,
      contentData,
      totalCount,
      pagingOffset,
    } = this.props;

    if (pagingCanGoNextLoading) {
      return false;
    }

    if (!isNil(pagingCanGoNext)) {
      return pagingCanGoNext;
    }

    let canGoNext = !contentData[contentData.length - 1];
    if (totalCount) {
      if (!isNil(pagingOffset)) {
        canGoNext = (pagingOffset + contentData.length) !== totalCount;
      } else {
        canGoNext = contentData.length !== totalCount || !contentData[contentData.length - 1];
      }
    } else {
      canGoNext = !contentData[contentData.length - 1];
    }

    return canGoNext;
  };

  getCanGoPrevious = () => {
    const {
      pagingCanGoPrevious,
      pagingCanGoPreviousLoading,
      contentData,
      pagingOffset
    } = this.props;

    if (pagingCanGoPreviousLoading) {
      return false;
    }

    if (!isNil(pagingCanGoPrevious)) {
      return pagingCanGoPrevious;
    }

    if (!isNil(pagingOffset)) {
      return pagingOffset !== 0;
    }
    return !contentData[0];
  };


  /** calculateInnerItemToView
   * The item object contains a selector (using that aria-rowindex attribute)
   * and a localClientTop captured at the time of interaction (focus or click).
   * This allows us to find the item again after a render and scroll it to the same relative screen position.
   *
   * mclRect: The bounding client of the table (screen coordinates)
   * rowRect: The bounding client rect of the row (screen coordinates)
   * rowRect.top - mclRect.top gives the position of the row relative to the parent MCL.
   *
   * The onMarkPosition prop is called to update the itemToView at the App level.
   */
  calculateInnerItemToView = (targetElem) => {
    const rowElem = targetElem.closest(`.${css.mclRowFormatterContainer}`);
    if (!rowElem) return;
    const rowIndex = rowElem?.getAttribute('aria-rowindex');
    const mclRect = this.scrollContainer.current?.getBoundingClientRect();
    if (mclRect) {
      const rowRect = rowElem.getBoundingClientRect();
      this.itemToView = {
        selector: `[aria-rowindex="${rowIndex}"]`,
        localClientTop: rowRect.top - mclRect.top,
      };
      this.itemToViewIsStale = false;
      if (this.props.onMarkPosition) {
        this.props.onMarkPosition(this.itemToView);
      }
    }
  }

  // This executes after all columns have been sized and if the width and height of the grid changes.
  scrollToItemToView = () => {
    const {
      columns,
      columnWidths,
    } = this.state;

    const {
      itemToView,
      onMarkReset,
      virtualize
    } = this.props;

    const item = itemToView || this.itemToView;

    // itemToViewIsStale is set to true whenever a scroll or resize happens.
    // we use it to keep from performing the same measure and scroll operation more than once.
    if (item &&
      columns.length === Object.keys(columnWidths).length &&
      this.itemToViewIsStale === false
    ) {
      // used the stored selector to find the item in the dom.
      const itemElem = this.container.current.querySelector(item.selector);

      // item element may not be found in the dom if the grid is virtualized and the item is out of view.
      // If it is found, we scroll to where it's visible with roughly the same screen position as before,
      // regardless of change in dimension which could shift the element.

      // internal itemToView stores the vertical position relative to the top of the MCL scroll container..
      // itemRect: the current item rectangle (could be shifted) or reset...
      // mclRect: the scrollContainer rect.
      // currentLocalClientTop = the current offset from the top of the MCL to the item.
      // Subtract the stored localClientTop fromThis.itemToview from the current offset to get the scrollOffset.

      if (itemElem) {
        const itemRect = itemElem.getBoundingClientRect();
        const mclRect = this.scrollContainer.current?.getBoundingClientRect();
        const currentLocalClientTop = itemRect.top - mclRect.top;
        const scrollOffset = currentLocalClientTop - item.localClientTop;
        this.scrollContainer.current.scrollTop += scrollOffset;
        this.itemToViewIsStale = true;
        if (this.props.onMarkPosition) {
          this.props.onMarkPosition(this.itemToView);
        }
      } else if (!virtualize) {
        this.itemToView = null;
        if (onMarkReset) {
          onMarkReset();
        }
      }
    }
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
            newState.rowWidth = computeRowWidth(newState.columnWidths, this.state.columns);
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
    this.itemToViewIsStale = true;

    // handle vertical scrolling
    if (this.props.virtualize && scrollTop !== this.prevVScroll) {
      this.throttledHandleScroll(scrollTop, scrollLeft);
      this.prevVScroll = scrollTop;
    }

    this.scrollRAF = requestAnimationFrame(() => {
      if (this.headerRow.current && this.scrollContainer.current) {
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

    this.props.onScroll(e, e.scrollTop, e.scrollLeft);
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
      { [css.mclClickableRow]: this.props.onRowClick }
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

  /**
   * handleMouseDown
   * This element is applied to the MCL scrollable container to capture all mouse down events within.
   * MCL uses this to capture clicks within rows (links, checkboxes, whatever) and find the nearest row (item)
   * we store the selector and the local offset for the row.
   * This information is use to scroll the item to view after any width/layout changes
   */
  handleMouseDown = (e) => {
    this.calculateInnerItemToView(e.target);
  }

  /**
   * handleRowFocus
   * This element is applied to each row within the MCL to capture focus events.
   * Performs the same function as handleMouseDown, but for keyboard navigation.
   * It's added to rows to avoid capturing focus on the scrollable container itself.
   */
  handleRowFocus = (e) => {
    this.calculateInnerItemToView(e.target);
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
    const defaultStyle = {
      minWidth: `${Math.max((widthVar - (hasMargin ? ROWMARGIN + SCROLLBAR_WIDTH : SCROLLBAR_WIDTH)), rowWidthVar)}px`,
    };

    const onClick = onRowClick ? (e) => { this.handleRowClick(e, this.getRowData(rowIndex)); } : undefined;
    const onKeyDown = (e) => this.handleRowKeyPress(e, this.getRowData(rowIndex));
    const defaultRowProps = {
      // eslint-disable-next-line
      onClick,
      onKeyDown,
      'style': defaultStyle,
      'data-row-inner': rowIndex,
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
      ...cellObject, // cells... possible place for extension.
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
              className={css.mclRowFormatterContainer}
              onClick={onRowClick ? this.handleRowClick : undefined}
              onFocus={(e) => this.handleRowFocus(e, localRowIndex + 2)}
              onBlur={this.handleRowBlur}
              positionedRowStyle={positionedRowStyle}
            >
              {rowFormatter(injectedRowProps)}
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
      prevDataLength,
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
        shiftAfter={prevDataLength}
        rowIndex={rowIndex}
      >
        { /*  rowIndex passed through to children as localRowIndex since
              the outer scope rowIndex changes */
          ({ localRowIndex, position }) => {
            let askAmount = Math.min(pageAmount, totalCount - contentData.length);
            if (askAmount < 0 || totalCount === contentData.length) {
              askAmount = pageAmount > totalCount ? totalCount : pageAmount;
            }
            return (
              <LoaderRow
                key={`loader-row-${localRowIndex}-${this.keyId}`}
                askAmount={askAmount}
                height={heightIncrement}
                minWidth={rowWidth}
                rowIndex={localRowIndex}
                loadMore={this.handleLoadMore}
                className={loaderClassname}
                columns={columns}
                styleTop={position}
                columnWidths={columnWidths}
              />
            );
          }
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
      staticBody,
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
        {({ position }) => {
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

  renderPagingRow = (rowIndex) => {
    const {
      dataEndReached,
      id,
      width,
      pageAmount,
      pagingButtonLabel,
      virtualize,
      pagingType,
    } = this.props;

    const {
      prevWidth,
      loading,
      staticBody,
    } = this.state;

    if (pagingType === pagingTypes.LOAD_MORE) {
      return (
        <LoadMorePaginationRow
          dataEndReached={dataEndReached}
          handleLoadMore={this.handleLoadMore}
          key="mcl-load-more-pagination-row"
          id={id}
          keyId={this.keyId}
          loading={loading}
          pageAmount={pageAmount}
          pagingButtonLabel={pagingButtonLabel}
          pagingButtonRef={this.pageButton}
          positionCache={this.positionCache}
          prevWidth={prevWidth}
          rowHeightCache={this.rowHeightCache}
          rowIndex={rowIndex}
          sendMessage={this.sendMessage}
          setFocusIndex={this.setFocusIndex}
          staticBody={staticBody}
          virtualize={virtualize}
          width={width}
        />
      );
    } else {
      return null;
    }
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
      dataStartIndex,
    } = this.state;

    this.framePositions = {};
    const rows = [];

    // beginning of sparse array...
    const scrollRange = scrollDirection === 'down' ? maxScrollDelta : 0;

    let bodyExtent;
    const bodyHeight = prevHeight || maxHeight;
    const heightIncrement = averageRowHeight || minimumRowHeight;
    if (virtualize && bodyHeight) {
      bodyExtent = bodyHeight * 2 + scrollTop;
    } else {
      // bodyExtent = contentData.length * heightIncrement;
      bodyExtent = Object.keys(contentData).length * heightIncrement;
    }

    /* look-ahead of a minimumRow + a maximumRow.
      This improves UX in scrolling (reducing white gaps at the top/bottom of the visible rows)
    */
    bodyExtent += (minimumRowHeight + this.maximumRowHeight + scrollRange * 2);
    let currentTop = firstIndex > dataStartIndex ? scrollTop : 0;
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
    let lastIndex = firstIndex;
    for (
      let rowIndex = firstIndex;
      ((currentTop <= bodyExtent) && (virtualize && totalCount ? rowIndex < totalCount : true));
      currentTop += minimumRowHeight, renderPosition += 1
    ) {
      if (contentData[rowIndex] && rowIndex < contentData.length) {
        rows.push(this.renderDataRow(rowIndex));
        dataRowsRendered += 1;
        rowIndex += 1;
      } else if (loaderSettings.load && (totalCount === 0 || rowIndex < totalCount)) {
        if (totalCount === 0) {
          currentTop = bodyExtent;
        }
        if (pagingType === pagingTypes.SCROLL) {
          rows.push(this.renderLoaderRow(rowIndex, dataRowsRendered, heightIncrement));
          rowIndex += 1;
        } else if (pagingType === pagingTypes.LOAD_MORE) {
          currentTop = bodyExtent;
          rows.push(this.renderPagingRow(rowIndex));
        }
      }
      lastIndex = rowIndex;
    }

    const endIndex = onNeedMoreData ? renderPosition : dataRowsRendered;
    // keep a count of the amount of rows rendered in the view.
    this.rowCount = endIndex - firstIndex;
    rows.push(this.renderEndOfList(endIndex, renderPosition));

    return { renderedRows: rows, lastIndex }
  }

  renderCells = (rowIndex, rowData) => {
    const {
      formatter,
      contentData,
      columnOverflow,
      id,
      columnWidths: columnWidthsProp,
      getCellClass,
      stickyFirstColumn,
      stickyLastColumn,
    } = this.props;
    const { columnWidths, columns, modColumns } = this.state;
    const cells = [];
    const labelStrings = [];

    columns.forEach((col, colIndex) => {
      let value;

      const cellStyleClass = typeof getCellClass === 'function' ?
        getCellClass(css.mclCellStyle, rowData, col) : css.mclCellStyle;

      if (formatter && Object.prototype.hasOwnProperty.call(formatter, col)) {
        value = formatter[col]({ ...contentData[rowIndex], rowIndex });
      } else {
        value = contentData[rowIndex][col];
      }

      let cellStyle = null;
      let stickyClasses = '';
      if (columnWidths[col]) {
        cellStyle = { width: this.state.columnWidths[col] };


        if (colIndex === columns.length - 1 &&
          get(columnWidthsProp, `${col}.max`) === undefined) {
          cellStyle = { minWidth: this.state.columnWidths[col], flex: 'auto' };
        }

        // stick classes... we only apply them after we have column widths
        if (stickyFirstColumn && colIndex === 0) stickyClasses = css.mclSticky;
        if (stickyLastColumn && colIndex === columns.length - 1) stickyClasses = `${css.mclSticky} ${css.mclStickyEnd}`;
      }

      const showOverflow = (columnOverflow[col]) ? css.mclShowOverflow : '';
      const colWidthsVar = columnWidths[col] || columnWidthsProp[col];
      // eslint-disable-next-line
      const shouldMeasure = (modColumns.includes(col) && !columnWidths[col] || !colWidthsVar);

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
          {(elementRef) => (
            <div
              role="gridcell"
              key={`${col}-${rowIndex}-${this.keyId}`}
              className={classnames(css.mclCell, showOverflow, cellStyleClass, stickyClasses)}
              style={cellStyle}
              ref={elementRef}
            >
              {value}
            </div>
          )}
        </CellMeasurer>
      ));
    });

    return { cells, labelStrings };
  }

  // Column Logic
  // eslint-disable-next-line no-unused-vars
  maybeUpdateColumnWidths = (rowIndex, columnName, width) => {
    const { columnWidths: columnWidthsState, prevHeight } = this.state;
    const { contentData, minimumRowHeight, columnWidths: cwProp } = this.props;
    const minHeightSample = prevHeight > 0 ? prevHeight / minimumRowHeight : 15;
    const sample = Math.min(contentData.length, minHeightSample);
    if (!this.calculatedColumns) this.calculatedColumns = {};
    if (this.widthCache[columnName].length >= sample &&
      !columnWidthsState[columnName] &&
      !this.calculatedColumns[columnName]) {
      // there may be other calculation types later... or possibly a prop for this function...
      let columnModifiers;
      // extra width for columns cells...
      const columnExtra = 30;
      if (typeof cwProp[columnName] === 'object') columnModifiers = cwProp[columnName];
      const newWidth = calculateColumnWidth3q(
        this.widthCache[columnName],
        this.headerWidths,
        columnName,
        columnExtra,
        columnModifiers
      );
      // to avoid re-calculating, track the calculated columns at the instance level.
      this.calculatedColumns[columnName] = newWidth;

      this.setState(curState => {
        const newState = {
          columnWidths: { ...curState.columnWidths, [columnName]: newWidth }
        };
        newState.rowWidth = computeRowWidth(newState.columnWidths, curState.columns);
        return newState;
      }, () => {
        this.calculatedColumns = {};
        if (Object.keys(this.state.columnWidths).length === this.state.columns.length) {
          this.scrollToItemToView();
        }
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
    const {
      showSortIndicator,
      sortableFields,
    } = this.props;

    const isSortable = sortableFields.length
      ? sortableFields.includes(column)
      : isInteractive;

    return classnames(
      css.mclHeader,
      { [`${css.mclClickable}`]: isInteractive },
      { [`${css.mclSorted}`]: sortedBy },
      { [`${css.mclAscending}`]: (sortedBy && this.props.sortDirection === 'ascending') },
      { [`${css.mclDescending}`]: (sortedBy && this.props.sortDirection === 'descending') },
      { [`${css.mclSortIndicator}`]: showSortIndicator && isSortable && !sortedBy },
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
    const { modColumns, columnWidths, columns, hasScrollbar } = this.state;
    const {
      columnIdPrefix,
      columnWidths: columnWidthsProp,
      getHeaderCellClass,
      id,
      nonInteractiveHeaders,
      onHeaderClick,
      sortDirection,
      sortOrder,
      sortedColumn,
      stickyFirstColumn,
      stickyLastColumn,
    } = this.props;
    const headers = [];
    columns.forEach((header, i) => {
      if (!this.widthCache[header]) {
        this.widthCache[header] = new DimensionCache(null, false);
      }

      let columnId;
      let clickableId;
      const idPrefix = columnIdPrefix ? columnIdPrefix + '-' : '';
      if (header === ' ') {
        columnId = `${idPrefix}list-column-${i}`;
        clickableId = `${idPrefix}clickable-list-column-${i}`;
      } else {
        columnId = `${idPrefix}list-column-${header.replace(/\s/g, '').toLowerCase()}`;
        clickableId = `${idPrefix}clickable-list-column-${header.replace(/\s/g, '').toLowerCase()}`;
      }

      const isSortHeader = (sortOrder === header || sortedColumn === header);
      const isInteractive = onHeaderClick && !nonInteractiveHeaders.includes(header);

      const headerWidth = columnWidths[header];

      const defaultHeaderCellClass = this.getHeaderClassName(header, isSortHeader, isInteractive);

      let headerStyle;
      let headerCellClass;

      let stickyClasses = '';
      if (columnWidths[header]) {
        // stick classes... we only apply them after we have column widths
        if (stickyFirstColumn && i === 0) stickyClasses = css.mclSticky;
        if (stickyLastColumn && i === columns.length - 1) {
          stickyClasses = `${css.mclSticky} ${css.mclStickyEnd}`;
        }
      }

      if (headerWidth) {
        headerStyle = { flex: `0 0 ${headerWidth}px`, width: `${headerWidth}px` };
        const customHeaderClass = typeof getHeaderCellClass === 'function' && getHeaderCellClass(header);
        headerCellClass = customHeaderClass ? `${defaultHeaderCellClass} ${customHeaderClass}` : defaultHeaderCellClass;
        if (i === columns.length - 1 && hasScrollbar) {
          headerStyle = { flex: `1 0 ${headerWidth + SCROLLBAR_WIDTH}px` };
        }
      } else {
        headerStyle = { flex: '0 0 auto' };
        headerCellClass = defaultHeaderCellClass;
      }

      headerCellClass = classnames(headerCellClass, stickyClasses);

      let headerInner;
      if (isInteractive) {
        headerInner = (
          <div
            role="button"
            tabIndex="0"
            className={css.mclHeaderOuter}
            data-test-clickable-header
            onClick={(e) => { this.handleHeaderClick(e, header); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { this.handleHeaderClick(e, header); } }}
            onKeyUp={(e) => { if (e.key === ' ') { this.handleHeaderClick(e, header); } }}
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

      let shouldMeasure = false;
      const headerMeasured = this.headerWidths.request(header);
      const needsMeasuring = (modColumns.includes(header) && headerMeasured === null);
      const noWidthHintProvided = (!columnWidthsProp[header] && this.headerWidths.request(header) === null);
      shouldMeasure = (needsMeasuring || noWidthHintProvided);

      headers.push(
        <CellMeasurer
          key={`header-${header}`}
          widthCache={this.headerWidths}
          gridId={id}
          rowIndex={header}
          columnName={header}
          shouldMeasure={shouldMeasure}
        >
          {(elemRef) => (
            <div
              role="columnheader"
              className={headerCellClass}
              aria-sort={isSortHeader ? sortDirection : 'none'}
              style={headerStyle}
              id={columnId}
              ref={elemRef}
            >
              {headerInner}
            </div>
          )}
        </CellMeasurer>
      );
    });
    return headers;
  }

  _loadMore(askAmount, index, direction) {
    const { onNeedMoreData } = this.props;
    const { loading, firstIndex } = this.state;
    if (!loading && onNeedMoreData) {
      onNeedMoreData(askAmount, index, firstIndex, direction);
      this.setState({ loading: true });
    }
  }

  handleLoadMore = (askAmount, index, direction) => {
    if (index === 0 || index === this.state.firstindex || index % this.props.pageAmount !== 0) {
      this.debouncedLoadMore(askAmount, index, direction);
    } else {
      this._loadMore(askAmount, index, direction);
    }
  }

  handleMoreResultsLoaded = () => {
    const { intl: { formatMessage } } = this.props;
    this.sendMessage(formatMessage({ id: 'stripes-components.mcl.additionalResultsLoaded' }));
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
    const { totalCount, wrapCells, height, minimumRowHeight, virtualize, pagingType, scrollToIndex } = this.props;
    const { receivedRows, rowWidth, averageRowHeight } = this.state;

    let position = 'static';
    if (this.props.virtualize) {
      position = 'relative';
    }

    let width = rowWidth || this.props.width || '100%';
    if (wrapCells) width = '100%';

    let newHeight;
    let newMinHeight = 0;

    if (scrollToIndex !== 0) {
      newMinHeight = scrollToIndex * minimumRowHeight;
    }

    /* if the height prop is not defined, the size of the physical container is ever-growing
    *  with the size of the contentData.
    */
    if (height !== undefined) {
      // if we have a totalCount, we can set size based on that... if not, the receivedRows count.
      const scrollBarHeight = 20;
      const paginationHeight = pagingType === pagingTypes.PREV_NEXT ? this.paginationHeight : 0;

      newHeight = Math.max(
        ((pagingType !== pagingTypes.SCROLL ? receivedRows : totalCount || receivedRows) * minimumRowHeight),
        (height - this.headerHeight - scrollBarHeight - paginationHeight)
      );

      const rowContainerStyles = {
        position,
        width,
        height: `${newHeight}px`,
      };

      if (newHeight > newMinHeight + height) {
        rowContainerStyles.minHeight = `${newMinHeight + height}px`;
      }

      return rowContainerStyles;
    } else if (virtualize) {
      newHeight = receivedRows * averageRowHeight;
      return {
        height: `${newHeight}px`,
        minHeight: `${newMinHeight + Math.min(window.innerHeight, newHeight)}px`,
        width,
        position
      };
    }
    return { position };
  }

  getScrollableStyle = () => {
    const {
      height,
      maxHeight,
      pagingType,
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

    const paginationHeight = pagingType === pagingTypes.PREV_NEXT ? this.paginationHeight : 0;

    /* State.bodyHeight will be filled in later if it isn't already...
    *  which will set the height for the extent of the data rows;
    */

    // maxHeight will use bodyHeight if bodyHeight is less...
    if (bodyHeight && maxHeight) {
      scrollableStyle.height = Math.min(bodyHeight, maxHeight - this.headerHeight - paginationHeight);
    } else if (heightVar > 0) { // if we've got a positive height prop, use it...
      scrollableStyle.height = heightVar - this.headerHeight - paginationHeight;
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
  };

  render() {
    const {
      contentData,
      dndProvided,
      getRowContainerClass,
      isEmptyMessage,
      totalCount,
      loading,
      hasMargin,
      pagingCanGoNextLoading,
      pagingCanGoPreviousLoading,
      pagingType,
      pageAmount,
      virtualize,
      hidePageIndices,
      pagingOffset,
      pagingButtonLabel,
      dataEndReached,
      id
    } = this.props;

    const {
      staticBody,
      dataStartIndex,
      dataEndIndex,
      loading: loadingState,
    } = this.state;

    // if grid is hidden, (containing elements set to display: none) return null.
    if (this.resetIfGridHidden()) {
      return null;
    }

    // if contentData is empty, render empty message...
    if (contentData.length === 0 && !loading) {
      return (
        <div
          className={css.mclEmptyMessage}
          style={{ minWidth: this.props.width || '200px' }}
          ref={this.container}
          id={id ? id + '-empty' : undefined}
        >
          {typeof isEmptyMessage === 'string' ? <EmptyMessage>{isEmptyMessage}</EmptyMessage> : isEmptyMessage}
        </div>
      );
    }

    const renderedHeaders = this.renderHeaders();
    const { renderedRows, lastIndex } = this.renderRows();

    const rowContainerClass = (typeof getRowContainerClass === 'function')
      ? getRowContainerClass(css.mclRowContainer)
      : css.mclRowContainer;

    return (
      <StripesOverlayWrapper>
        <HotKeys handlers={this.handlers} attach={this.shortcutsRef} noWrapper>
          <div className={css.mclContainer} ref={this.shortcutsRef} style={this.getOuterElementStyle()}>
            <SRStatus ref={this.status} />
            <div
              tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
              id={this.props.id}
              ref={this.container}
              role="grid"
              aria-rowcount={this.getAccessibleRowCount()}
              className={classnames({ [css.hasMargin]: hasMargin })}
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
              {/* eslint-disable jsx-a11y/no-static-element-interactions */}
              <div
                className={css.mclScrollable}
                style={this.getScrollableStyle()}
                onScroll={this.handleScroll}
                ref={this.scrollContainer}
                {...getScrollableTabIndex(this.scrollContainer)}
                onMouseDown={this.handleMouseDown}
              >
                <div
                  className={rowContainerClass}
                  role="rowgroup"
                  style={this.getRowContainerStyle()}
                  ref={this.rowContainer}
                >
                  {renderedRows}
                  {dndProvided.placeholder}
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
            {
              pagingType === pagingTypes.PREV_NEXT && (
                <PrevNextPaginationRow
                  activeNext={this.getCanGoNext()}
                  activePrevious={this.getCanGoPrevious()}
                  dataEndReached={dataEndReached}
                  handleLoadMore={this.handleLoadMore}
                  id={id}
                  key="mcl-prev-next-pagination-row"
                  keyId={this.keyId}
                  loading={loadingState}
                  loadingNext={pagingCanGoNextLoading}
                  loadingPrevious={pagingCanGoPreviousLoading}
                  pageAmount={pageAmount}
                  pagingButtonLabel={pagingButtonLabel}
                  pagingButtonRef={this.pageButton}
                  positionCache={this.positionCache}
                  rowHeightCache={this.rowHeightCache}
                  rowIndex={lastIndex}
                  sendMessage={this.sendMessage}
                  setFocusIndex={this.setFocusIndex}
                  staticBody={staticBody}
                  virtualize={virtualize}
                  dataStartIndex={typeof pagingOffset !== 'undefined' ? pagingOffset + 1 : dataStartIndex + 1}
                  dataEndIndex={typeof pagingOffset !== 'undefined' ? pagingOffset + dataEndIndex + 1 : dataEndIndex + 1} // eslint-disable-line
                  hidePageIndices={hidePageIndices}
                  pagingOffset={pagingOffset}
                  containerRef={this.paginationContainer}
                />
              )
            }
          </div>
        </HotKeys>
      </StripesOverlayWrapper>
    );
  }
}
export default injectIntl(MCLRenderer);
