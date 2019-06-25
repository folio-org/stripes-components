import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import {
  isEqual,
  isFinite,
  debounce,
} from 'lodash';

import Icon from '../Icon';
import EmptyMessage from '../EmptyMessage';
import Layout from '../Layout';
import { HotKeys } from '../HotKeys';
import parseCSSUnit from '../../util/parseCSSUnit';
import css from './MCLRenderer.css';
import defaultRowFormatter from './defaultRowFormatter';
import CellMeasurer from './CellMeasurer';
import RowMeasurer from './RowMeasurer';
import LoaderRow from './LoaderRow';

import * as baseHandlers from './defaultHandlers';

const propTypes = {
  autosize: PropTypes.bool,
  columnMapping: PropTypes.object,
  columnOverflow: PropTypes.object,
  columnWidths: PropTypes.object,
  containerRef: PropTypes.func,
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
};


// function updateDimensions(props, state) {
//   const {
//     height,
//     contentData,
//   } = props;
//   const {
//     minimumRowHeight,
//     overscanRows,
//   } = state;

//   // if we don't have a height, then we'll just render whatever data we have...
//   let newAmount;
//   if (!height) {
//     newAmount = contentData.length;
//   } else {
//     newAmount = parseInt(height / minimumRowHeight, 10) + (overscanRows * 2);
//   }

//   const dimensions = {
//     amountToRender: newAmount,
//   };

//   return dimensions;
// }

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

    this.styleCache = [];
    this.rowCache = [];
    this.rowContainer = React.createRef();
    this.headerRow = React.createRef();
    this.headerContainer = React.createRef();
    this.container = this.props.containerRef;
    this.scrollContainer = React.createRef();
    this.endOfList = React.createRef();
    this.headerHeight = 0;
    this.focusedRowIndex = null;

    this.generateHeaders = this.generateHeaders.bind(this);
    this.debouncedLoadMore = debounce(this._loadMore.bind(this), 100, { trailing: true, leading: true });
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.getRowClass = this.getRowClass.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.getHeaderClassName = this.getHeaderClassName.bind(this);

    this.state = {
      receivedRows: contentData.length,
      totalRows: contentData.length,
      contentTop: 0,
      firstIndex: scrollToIndex,
      scrollTop: 0,
      overscanRows: 3,
      loading: false,
      headerWidths: {},
      columnWidths: props.columnWidths,
      widthCache:{},
      averageRowHeight: 0,
      adjustedHeight: null,
      endOfListHeight: null,
      minimumRowHeight: 24,
      prevHeight: 0,
    };

    this.handlers = Object.assign({
      selectPreviousRow: (e) => { baseHandlers.selectPreviousRow(e,) },
      selectNextRow: this.selectNextRow,
      selectFirstOrCurrentRow: this.selectFirstOrCurrentRow,
      unfocusRow: this.unFocusRow,
      focusBeyond: this.focusBeyond,
    }, this.props.hotKeys.handlers);

    if (Object.prototype.hasOwnProperty.call(props, 'instanceRef')) {
      props.instanceRef(this);
    }
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
    } = props;

    let newState = {};

    // data has changed
    if (receivedRows !== contentData.length) {
      newState.receivedRows = contentData.length;
      newState.loading = false;
      // set last index if we recieved data for the first time;
      if (receivedRows === 0) {
        newState.lastIndex = scrollToIndex + Math.min(contentData.length, 30);
        if (totalCount !== 0 && newState.lastIndex > totalCount) {
          newState.lastIndex = totalCount - 1;
        }
      }

      // smaller incoming data set (filter/query change) reset
      if (contentData.length < receivedRows) {
        newState.receivedRows = 0;
        newState.firstIndex = 0;
        newState.contentTop = 0;
        newState.adjustedHeight = null;
      }

      if (prevHeight !== height) {
        // const newDims = updateDimensions(props, state);
        newState = Object.assign(newState, { prevHeight: height, receivedRows: contentData.length });
      }
    }

    // if we just received data for the first time or after reset (no columns)
    if (!columns) {
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

  componentDidUpdate(prevProps, prevState) {
    let newState = {};
    if (this.headerRow.current && this.scrollContainer.current) {
      const rowElem = this.rowContainer.current.querySelector(`.${css.mclRow}`);
      if (rowElem) {
        this.headerRow.current.style.width = `${rowElem.offsetWidth}px`;
      }
      this.headerContainer.current.scrollLeft = this.scrollContainer.current.scrollLeft;
    }

    if (this.props.virtualize) {
      // const endOfListHeight = this.endOfList.current ? this.endOfList.current.offsetHeight : 0;
      // if (endOfListHeight !== this.state.endOfListHeight) {
      //   newState = Object.assign(newState, { endOfListHeight });
      // }
    }

    // no measured rowHeights, no average height.
    if (
      this.props.contentData.length > 0 &&
      this.rowCache.length > 0 &&
      this.state.averageRowHeight === 0
    ) {
      if (this.headerRow.current) {
        this.headerHeight = this.headerRow.current.offsetHeight;
      }

      const avg = this.updateAverageHeight();
      newState = Object.assign(newState, { averageRowHeight: avg });
    }

    if (prevProps.contentData.length > this.props.contentData) {
      this.rowCache = [];
      this.styleCache = [];
    }

    let widthsShouldUpdate = false;
    this.state.columns.forEach(col => {
      if (widthsShouldUpdate || !isEqual(this.state.widthCache[col], prevState.widthCache[col])) {
        widthsShouldUpdate = true;
      }
    });

    if (widthsShouldUpdate) {
      const columnWidths = this.setColumnWidths();
      newState = Object.assign(newState, { ...columnWidths });
    }

    // only setState in cDU under certain conditions...
    if (Object.keys(newState).length > 0) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(newState);
    } else if (this.rowCache.length === 0 && this.props.contentData.length > 0) {
      this.forceUpdate();
    }
  }

  setHeaderWidth = (w, c) => {
    if (w > this.state.headerWidths[c] || !this.state.headerWidths[c]) {
      this.setState(curState => {
        return {
          headerWidths: { ...curState.headerWidths, [c]: w }
        };
      });
    }
  };

  collectWidth = (w, c, i) => {
    this.setState(curState => {
      return {
        widthCache: {
          ...curState.widthCache,
          [c]: { ...curState.widthCache[c], [i]: w }
        }
      };
    });
  };

  collectHeight = (h, i) => {
    if (!this.rowCache[i]) {
      this.styleCache[i] = this.rowCache.reduce((p, c, index) => { return index < i ? p + c : p; }, 0);
      this.rowCache[i] = h;
    }
  };

  calculateWidth = c => {
    // if width for the column is provided via a prop, use that instead.
    const { columnWidths, width } = this.props;
    if (columnWidths && columnWidths[c]) {
      let convertedWidth;
      const parsedAmount = parseInt(columnWidths[c], 10);
      switch (parseCSSUnit(this.props.columnWidths[c])) {
        case 'percent':
        case 'vw':
          convertedWidth = parsedAmount * 0.01 * width;
          break;
        case 'px':
          convertedWidth = parsedAmount;
          break;
        case 'em':
        case 'rem':
          // system rem of 14
          convertedWidth = parsedAmount * 14;
          break;
        default:
          convertedWidth = parsedAmount;
      }
      return convertedWidth;
    }
    const { widthCache, headerWidths } = this.state;
    const extracted = [];
    for (const k in widthCache[c]) {
      if (Object.prototype.hasOwnProperty.call(widthCache[c], k)) {
        extracted.push(widthCache[c][k]);
      }
    }
    const sorted = extracted.sort((a, b) => a - b);
    // if delta between shortest and longest non-zero is small, use the longest.
    let shortestLength = sorted.find((n) => n > 0);
    if (!shortestLength) {
      shortestLength = 0;
    }
    let possibleWidth;
    if (sorted[sorted.length - 1] - shortestLength < 80) {
      possibleWidth = sorted[sorted.length - 1];
    } else {
      // otherwise, use the 3rd quartile value.
      const q3Index = Math.floor(sorted.length * 0.75);
      possibleWidth = sorted[q3Index];
      if (possibleWidth === 0) {
        possibleWidth = shortestLength;
      }
    }

    let resWidth;
    if (possibleWidth < headerWidths[c]) {
      resWidth = headerWidths[c] + 20;
    } else {
      resWidth = possibleWidth + 20;
    }
    // console.log(`${c}: ${resWidth}`);
    return resWidth;
  };

  setColumnWidths = () => {
    console.log("setting column widths");
    const { widthCache } = this.state;
    const columnWidths = {};
    let rowWidth = 0;
    for (const c in widthCache) {
      if (Object.prototype.hasOwnProperty.call(widthCache, c)) {
        columnWidths[c] = this.calculateWidth(c);
        rowWidth += columnWidths[c];
      }
    }
    return { columnWidths, rowWidth };
  };

  updateDimensions = (height, data) => {
    const minimumRowHeight = this.state.minimumRowHeight;

    // if we don't have a height, then we'll just render whatever data we have...
    let newAmount;
    if (!height) {
      newAmount = data.length;
    } else {
      newAmount = parseInt(height / minimumRowHeight, 10) + (this.state.overscanRows * 2);
    }

    const dimensions = {
      amountToRender: newAmount,
    };

    return dimensions;
  };

  backToTop = () => {
    this.rowCache = [];
    if (this.scrollContainer.current) {
      this.scrollContainer.current.scrollTop = 0;
    }
    this.setState({
      firstIndex: 0,
      contentTop: 0,
      scrollTop: 0,
      adjustedHeight: null,
    });
  };

  setEndOfListOffset = () => {
    // const eOL = this.endOfList.current;
    // if (eOL) {
    //   // 5 pixels are needed to allow recalculation of the list row items when details pane is closed
    //   eOL.style.left = `${Math.max(this.headerRow.scrollLeft - 5, 0)}px`;
    // }
  };

  handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    // console.log('handle scroll');
    if (this.props.virtualize) {
      this.handleInfiniteScroll(scrollTop);
    } else {
      this.handleFiniteScroll(scrollTop);
    }
    this.props.onScroll(e);
  }

  handleFiniteScroll = (e) => {
    // const { onNeedMoreData, height } = this.props;
    // if (onNeedMoreData) {
    //   const currentScroll = e.target.scrollTop;
    //   const nextState = { scrollTop: currentScroll };

    //   // if we're 2 container-heights away (or less ) from the end of the data, fetch more...
    //   // if (!this.state.loading && (height - currentScroll < height * 2)) {
    //   //   onNeedMoreData();
    //   //   nextState.loading = true;
    //   // }

    //   this.setState({ ...nextState });
    // }

    // this.setEndOfListOffset();
  };

  handleInfiniteScroll = (currentScroll) => {
    const nextState = { scrollTop: currentScroll };

    const newFirstIndex = this.styleCache.findIndex(s => s > currentScroll);
    nextState.firstIndex = newFirstIndex - 1;

    this.setState(curState => ({
      ...nextState,
    }));
  };

  // Row logic

  updateAverageHeight = () => {
    let sum = 0;
    this.rowCache.forEach((l) => { sum += l; });
    const avg = sum > 0 ? sum / this.rowCache.length : 0;
    // this.averageRowHeight = avg;
    return avg;
  };

  getRowClass = (rowIndex) => {
    const selectedClass = this.props.selectedClass ? this.props.selectedClass : css.mclSelected;

    return classnames(
      css.mclRow,
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

  renderRows = () => {
    const {
      width,
      height,
      contentData,
      columnMapping,
      interactive,
      totalCount,
      virtualize,
      visibleColumns,
      rowFormatter,
      onNeedMoreData,
      rowProps: pRowProps,
      id,
    } = this.props;

    const {
      firstIndex,
      columnWidths,
      scrollTop,
      columns,
      averageRowHeight,
      scrollHeight,
      rowWidth,
      minimumRowHeight
    } = this.state;

    const rows = [];

    const defaultStyle = (rowWidth) ? { minWidth: `${rowWidth}px` } : null;

    let bodyExtent;
    if (height) {
      bodyExtent = height + scrollTop;
    } else if (this.scrollContainer.current) {
      bodyExtent = this.scrollContainer.current.offsetHeight;
    } else {
      return [];
    }

    let rendered = 0;
    let currentTop = scrollTop;
    let rowIndex;
    for (let i = firstIndex; currentTop <= bodyExtent; i += 1) {
      rowIndex = i;
      if (contentData[rowIndex]) {
        const defaultRowProps = {
          onClick: (e) => { this.handleRowClick(e, contentData[rowIndex]); },
          style: defaultStyle,
        };
        const cellObject = this.renderCells(rowIndex);
        const cells = cellObject.cells;
        const labelStrings = cellObject.labelStrings;

        const rowClass = this.getRowClass(rowIndex);
        const rowProps = Object.assign(defaultRowProps, pRowProps);
        const injectedRowProps = {
          rowIndex,
          rowClass,
          rowData: contentData[rowIndex],
          cells,
          rowProps,
          width,
          columnWidths,
          columns,
          columnMapping,
          labelStrings,
          interactive,
        };

        // render off-canvas for column measuring.
        if (!columnWidths || Object.keys(columnWidths).length < visibleColumns.length) {
          rows.push(
            <div key={`row-${rowIndex}`} className={css.mclOffCanvasRow}>
              {rowFormatter(injectedRowProps)}
            </div>
          );
        } else {
          currentTop += this.rowCache[rowIndex - 1] || 0;
          rows.push(
            <RowMeasurer
              getHeight={this.collectHeight}
              measure={this.state.columnWidths && !this.rowCache[rowIndex]}
              style={this.getRowStyle(currentTop, rowIndex)}
              rowIndex={rowIndex}
              onFocus={this.focuseRow}
              onBlur={this.blurRow}
              key={`row-${rowIndex}`}
            >
              {rowFormatter(injectedRowProps)}
            </RowMeasurer>
          );
        }
        rendered += 1;
      } else if (
        onNeedMoreData && totalCount > 0 &&
        rowIndex < totalCount &&
        rowIndex >= 0
      ) {
        // fill remaining rows with loaders.
        currentTop += averageRowHeight || minimumRowHeight;
        rows.push(
          <LoaderRow
            key={`row-${rowIndex}`}
            askAmount={Math.min(30, totalCount - contentData.length)}
            height={averageRowHeight || minimumRowHeight}
            index={rowIndex}
            loadMore={this.handleLoadMore}
            className={`${css.mclRow} ${rowIndex % 2 !== 0 ? css.mclIsOdd : ''}`}
            columns={columns}
            styleTop={currentTop}
            columnWidths={columnWidths}
            visible
          />
        );
        rendered += 1;
      }
    }

    // loading for non-virtualized lists && totalCount == 0...
    if ((
      onNeedMoreData && totalCount === 0 &&
      rendered < rowIndex) ||
    (!virtualize &&
      onNeedMoreData &&
      scrollTop > scrollHeight * 0.60
    )) {
      rows.push(
        <LoaderRow
          key={`${id}-loader-row`}
          askAmount={30}
          height={averageRowHeight}
          index={contentData.length}
          loadMore={this.handleLoadMore}
          columns={columns}
          columnWidths={columnWidths}
          visible={false}
        />
      );
    }

    return rows;
  }

  renderCells(rowIndex) {
    const { formatter, contentData, columnOverflow } = this.props;
    const { columnWidths } = this.state;

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
          key={`${col}-${rowIndex}`}
          className={`${css.mclCell} ${showOverflow}`}
          style={cellStyle}
        >
          <CellMeasurer
            getWidth={this.collectWidth}
            rowIndex={rowIndex}
            name={col}
            measure={!columnWidths || !columnWidths[col]}
            key={`cell-${col}-row-${rowIndex}`}
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
    const { columnWidths } = this.state;
    const headers = [];
    this.state.columns.forEach((header, i) => {
      let columnId;
      let clickableId;
      if (header === ' ') {
        columnId = `list-column-${i}`;
        clickableId = `clickable-list-column-${i}`;
      } else {
        columnId = `list-column-${header.replace(/\s/g, '').toLowerCase()}`;
        clickableId = `clickable-list-column-${header.replace(/\s/g, '').toLowerCase()}`;
      }

      let headerStyle = null;
      if (columnWidths) {
        headerStyle = { width: this.state.columnWidths[header] };
      }

      headers.push(
        <div
          key={`header-${header}`}
          role="columnheader"
          className={this.getHeaderClassName(header)}
          style={headerStyle}
          id={columnId}
        >
          <div
            role="presentation"
            data-test-clickable-header
            onClick={(e) => { this.handleHeaderClick(e, header); }}
            id={clickableId}
          >
            <CellMeasurer
              getWidth={this.setHeaderWidth}
              name={header}
              measure={!this.state.columnWidths}
            >
              {this.getMappedColumnName(header)}
            </CellMeasurer>
          </div>
        </div>,
      );
    });
    return headers;
  }

  _loadMore(askAmount, index) {
    const { onNeedMoreData } = this.props;
    if (!this.state.loading && onNeedMoreData) {
      onNeedMoreData(askAmount, index);
      this.setState({ loading: true });
      console.log(`${index} asked for ${askAmount} more`);
    }
  }

  handleLoadMore(askAmount, index) {
    this.debouncedLoadMore(askAmount, index);
  }

  getContainerStyle = () => {
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
    // if (!this.props.virtualize) {
    //   return { position: 'static' };
    // }

    // return { top: this.state.contentTop };
    const { totalCount } = this.props;
    const { averageRowHeight, receivedRows, adjustedHeight } = this.state;

    if (adjustedHeight) {
      return { height: adjustedHeight };
    }

    if (totalCount > 0) {
      return { height: totalCount * averageRowHeight };
    } else {
      return { height: receivedRows * averageRowHeight };
    }
  }

  getBodyStyle = () => {
    const {
      autosize,
      height,
      maxHeight,
      virtualize,
      width,
    } = this.props;

    const bodyStyle = {};
    // body will be scrollable if constrained in any way...
    if (autosize || height || maxHeight) {
      bodyStyle.overflow = 'auto';
    }
    // if height is explicit, body height will be the remainder of the container aside from the header
    if (height) {
      bodyStyle.height = height - this.headerHeight;
    }

    // if we've only got a maxHeight to work with, the body max-height property will be set...
    if (maxHeight && !height) {
      bodyStyle.maxHeight = maxHeight - this.headerHeight;
    }

    if (virtualize) {
      bodyStyle.maxHeight = maxHeight || 'none';
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

  setEndOfListOffset = () => {
    const eOL = this.endOfList.current;
    if (eOL && this.scrollContainer.current && this.headerRow.current) {
      eOL.style.left = `${this.scrollContainer.current.scrollLeft}px`;
      // 5 pixels are needed to allow recalculation of the list row items when details pane is closed
      eOL.style.left = `${Math.max(this.headerRow.current.scrollLeft - 5, 0)}px`;
    }
  };

  renderEndOfList = () => {
    // const {
    //   totalCount,
    //   width,
    // } = this.props;

    // const showEndOfList = this.rowCache.length === totalCount;

    // if (!showEndOfList) {
    //   return null;
    // }

    // const endOfListWidth = isFinite(width) ? Math.max(width, 200) : '100%';

    // return (
    //   <div
    //     key="end-of-list"
    //     ref={this.endOfList}
    //     className={css.mclEndOfList}
    //     style={{ width: endOfListWidth }}
    //   >
    //     <Layout className="textCentered">
    //       <Icon icon="end-mark">
    //         <FormattedMessage id="stripes-components.endOfList" />
    //       </Icon>
    //     </Layout>
    //   </div>
    // );
  }

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

  getRowStyle = (currentTop, rowIndex) => {
    if (this.styleCache[rowIndex]) return { top: `${this.styleCache[rowIndex]}px` };
    return { top: `${currentTop}px` };
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
          style={this.getContainerStyle()}
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
            style={this.getBodyStyle()}
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
              {this.renderEndOfList()}
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
