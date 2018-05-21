import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';
import Icon from '../Icon';
import EmptyMessage from '../structures/EmptyMessage';
import { HotKeys } from '../HotKeys';
import getNextFocusable from '../../util/getNextFocusable';
import css from './MCLRenderer.css';
import defaultRowFormatter from './defaultRowFormatter';

const propTypes = {
  virtualize: PropTypes.bool,
  onScroll: PropTypes.func,
  onNeedMoreData: PropTypes.func,
  contentData: PropTypes.arrayOf(PropTypes.object),
  height: PropTypes.number,
  width: PropTypes.number,
  formatter: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
  columnMapping: PropTypes.object,
  onHeaderClick: PropTypes.func,
  onRowClick: PropTypes.func,
  isEmptyMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.arrayOf([PropTypes.node]),
  ]),
  sortOrder: PropTypes.string,
  maxHeight: PropTypes.number,
  rowFormatter: PropTypes.func,
  scrollToIndex: PropTypes.number,
  hotKeys: PropTypes.object,
  columnWidths: PropTypes.object,
  containerRef: PropTypes.func,
  ariaLabel: PropTypes.string,
  rowProps: PropTypes.object,
  autosize: PropTypes.bool,
  rowMetadata: PropTypes.arrayOf(PropTypes.string),
  headerMetadata: PropTypes.object,
  sortedColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  selectedRow: PropTypes.object,
  selectedClass: PropTypes.string,
  id: PropTypes.string,
  columnOverflow: PropTypes.object,
  striped: PropTypes.bool,
  interactive: PropTypes.bool,
  headerRowClass: PropTypes.string,
  instanceRef: PropTypes.func,
};

const defaultProps = {
  onScroll: () => { },
  columnMapping: {},
  columnOverflow: {},
  formatter: {},
  isEmptyMessage: 'The list contains no items',
  contentData: [],
  selectedClass: css.selected,
  rowFormatter: defaultRowFormatter,
  scrollToIndex: 0,
  rowProps: {},
  hotKeys: { keyMap: {}, handlers: {} },
  striped: true,
  interactive: true,
};

class MCLRenderer extends React.Component {
  constructor(props) {
    super(props);

    const { visibleColumns, contentData, scrollToIndex } = this.props;

    this.rowCache = [];
    this.rowContainer = null;
    this.headerRow = null;
    this.container = null;
    this.headerHeight = 0;
    this.headerMaxLScroll = 0;
    this.bodyMaxLScroll = 0;
    this.focusedRow = null;
    // this.focusRowElement = null;

    this.handleFiniteScroll = this.handleFiniteScroll.bind(this);
    this.handleInfiniteScroll = this.handleInfiniteScroll.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.measureNewRows = this.measureNewRows.bind(this);
    this.measureColumns = this.measureColumns.bind(this);
    this.generateHeaders = this.generateHeaders.bind(this);
    this.updateAverageHeight = this.updateAverageHeight.bind(this);
    this.getRowClass = this.getRowClass.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.getHeaderClassName = this.getHeaderClassName.bind(this);
    this.maybeSelected = this.maybeSelected.bind(this);
    this.backToTop = this.backToTop.bind(this);
    this.getMappedColumnName = this.getMappedColumnName.bind(this);
    this.getBodyStyle = this.getBodyStyle.bind(this);
    this.getContainerStyle = this.getContainerStyle.bind(this);
    this.initColumnsFromData = this.initColumnsFromData.bind(this);
    this.selectFirstOrCurrentRow = this.selectFirstOrCurrentRow.bind(this);
    this.selectNextRow = this.selectNextRow.bind(this);
    this.selectPreviousRow = this.selectPreviousRow.bind(this);
    this.unFocusRow = this.unFocusRow.bind(this);
    this.focusBeyond = this.focusBeyond.bind(this);
    this.serveContainerRef = this.serveContainerRef.bind(this);
    this.getRowWidth = this.getRowWidth.bind(this);
    this.getHeaderStyle = this.getHeaderStyle.bind(this);

    let columns;
    if (visibleColumns) {
      columns = visibleColumns;
    } else if (contentData.length > 0) {
      columns = this.initColumnsFromData();
    }

    this.state = {
      totalRows: contentData.length,
      contentTop: 0,
      firstIndex: scrollToIndex,
      amountToRender: 3,
      scrollTop: 0,
      overscanRows: 3,
      loading: false,
      columns,
      columnWidths: contentData.length > 0 ? this.measureColumns({
        columns,
        colWidths: this.props.columnWidths,
      }) : {},
      averageRowHeight: 0,
      adjustedHeight: null,
    };

    this.handlers = Object.assign({
      selectPreviousRow: this.selectPreviousRow,
      selectNextRow: this.selectNextRow,
      selectFirstOrCurrentRow: this.selectFirstOrCurrentRow,
      unfocusRow: this.unFocusRow,
      focusBeyond: this.focusBeyond,
    }, this.props.hotKeys.handlers);

    if (Object.prototype.hasOwnProperty.call(props, 'instanceRef')) {
      props.instanceRef(this);
    }
  }

  componentDidMount() {
    // if by some mysterious occurence we actually have data when we mount...
    const newState = {};

    if (this.props.contentData.length > 0) {
      if (!this.state.columns) {
        newState.columns = this.props.visibleColumns ? this.props.visibleColumns : this.initColumnsFromData();
        newState.columnWidths = this.measureColumns();
      }

      // if(this.props.virtualize){
      this.measureNewRows();
      const rowAvg = this.updateAverageHeight();
      newState.averageRowHeight = rowAvg;
      const dimensions = this.updateDimensions(this.props.height, this.props.contentData, rowAvg);
      Object.assign(newState, dimensions);
      // } else {
      if (!this.props.virtualize) {
        newState.amountToRender = this.props.contentData.length;
        // if(onNeedMoreData){
        //   onNeedMoreData();
        //   newState.loading = true;
        // }
      }

      // setting state after the component mounts will trigger a second call
      // to render, which can maybe cause layout thrashing, so there's a lint
      // rule to recommend against that unless you know what you're doing.
      // Here, we're measuring a bunch of stuff on the DOM, which of course
      // isn't even there until after the component mounts. IOW, we know what
      // we're doing here, and we're doing it on purpose.
      //
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ ...newState });

      this.headerHeight = this.headerRow.offsetHeight;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { columns } = this.state;
    let newState = {};

    // sync number of rows...
    if (nextProps.contentData.length !== this.props.contentData.length) {
      newState.totalRows = nextProps.contentData.length;
      newState.loading = false;

      // if we just received data for the first time or after reset...
      if (this.props.contentData.length === 0) {
        newState.columns = nextProps.visibleColumns ? nextProps.visibleColumns : this.initColumnsFromData(nextProps.contentData);
        newState.columnWidths = this.measureColumns({
          data: nextProps.contentData,
          columns: newState.columns,
          colWidths: nextProps.columnWidths,
        });
      } else if (nextProps.contentData.length < this.props.contentData.length) {
        // if the next data set is smaller via filtering/query change, go back to top...
        this.rowCache = [];
        newState.firstIndex = 0;
        newState.contentTop = 0;
        newState.adjustedHeight = null;
      }
    }

    // stcom-29 update dimensions on height change...
    if (nextProps.contentData.length > 0) {
      if (nextProps.height !== this.props.height) {
        const newDims = this.updateDimensions(nextProps.height, nextProps.contentData);
        newState = Object.assign({}, newState, newDims);
      }
    }

    if (!isEqual(this.props.visibleColumns, nextProps.visibleColumns)) {
      newState.columns = nextProps.visibleColumns;
    }

    if (!isEqual(this.props.columnWidths, nextProps.columnWidths)) {
      newState.columnWidths = this.measureColumns(
        {
          columns,
          data: nextProps.contentData,
          colWidths: nextProps.columnWidths,
        },
      );
    }

    this.setState({ ...newState });
  }

  componentDidUpdate(prevProps, prevState) {
    // initial application of data, when data is first received or after reset...
    if (this.props.contentData.length > 0 && this.props.contentData.length !== prevProps.contentData.length) {
      requestAnimationFrame(() => {
        this.measureNewRows();
        if (this.headerRow) {
          this.headerHeight = this.headerRow.offsetHeight;
        }

        if (this.state.averageRowHeight === 0) {
          const avg = this.updateAverageHeight();
          const dimensions = this.updateDimensions(this.props.height, this.props.contentData, avg);
          this.setState({ averageRowHeight: avg, ...dimensions });
        }
      });
    }

    // if we have data available on first mounting, the averageRowHeight will have changed, so update accordingly
    if (prevState.averageRowHeight !== this.state.averageRowHeight) {
      const dimensions = this.updateDimensions(this.props.height, this.props.contentData);

      // setting state after the component updates can cause layout thrashing,
      // so there's a lint rule to recommend against that unless you know what
      // you're doing. Here, we're measuring DOM elements, which of course
      // aren't available until after mounting. IOW, we know what we're doing
      // here.
      //
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ ...dimensions });
    }

    if (prevProps.width !== this.props.width && this.props.contentData.length > 0) {
      this.headerHeight = this.headerRow.offsetHeight;
    }

    // commenting for now. FocusRowElement was originally found using refs - unreliable.
    // if (this.focusRowElement !== null && this.focusRowElement !== document.activeElement) {
    //   if (document.activeElement === this.container || contains(this.container, document.activeElement)) {
    //     this.focusRowElement.focus();
    //     this.focusRowElement = null;
    //   }
    // }
  }

  updateDimensions(height, data, avgHeight) {
    // Base-case to avoid a catastrophic divide-by-zero during a re-render.
    const averageRowHeight = avgHeight || this.state.averageRowHeight || 10;

    // if we don't have a height, then we'll just render whatever data we have...
    let newAmount;
    if (!height) {
      newAmount = data.length;
    } else {
      newAmount = parseInt(height / averageRowHeight, 10) + (this.state.overscanRows * 2);
    }
    let fetching = false;

    // get at least 2 screens worth of data...
    if (this.props.onNeedMoreData && data.length < newAmount * 2) {
      // if(this.props.virtualize){
      this.props.onNeedMoreData();
      fetching = true;
      // }
    }

    // commenting due to views on large screens not being filled out.
    // if (newAmount > data.length) {
    //   newAmount = data.length;
    // }

    const dimensions = {
      amountToRender: newAmount,
      loading: fetching,
    };

    return dimensions;
  }

  backToTop() {
    this.rowCache = [];
    this.scrollContainer.scrollTop = 0;
    this.setState({
      firstIndex: 0,
      contentTop: 0,
      scrollTop: 0,
      adjustedHeight: null,
    });
  }

  handleFiniteScroll(e) {
    const { onNeedMoreData, height } = this.props;
    if (onNeedMoreData) {
      const currentScroll = e.target.scrollTop;
      const nextState = { scrollTop: currentScroll };

      // if we're 2 container-heights away (or less ) from the end of the data, fetch more...
      if (!this.state.loading && (height - currentScroll < height * 2)) {
        onNeedMoreData();
        nextState.loading = true;
      }

      this.setState({ ...nextState });
    }

    this.headerRow.scrollLeft = e.target.scrollLeft;

    this.props.onScroll(e);
  }

  handleInfiniteScroll(e) {
    const { averageRowHeight, scrollTop, amountToRender, totalRows, overscanRows } = this.state;
    const currentScroll = e.target.scrollTop;
    const rowsPadding = averageRowHeight * overscanRows;
    const nextState = { scrollTop: currentScroll };

    if (currentScroll > rowsPadding) {
      // set position of rowContainer
      let topSpacer = (Math.ceil(currentScroll / averageRowHeight) * averageRowHeight) - averageRowHeight;
      topSpacer = topSpacer > 0 ? topSpacer : 0;
      nextState.contentTop = topSpacer;

      // calculate first index
      const rowsPast = topSpacer / averageRowHeight;
      nextState.firstIndex = Math.floor(rowsPast);

      // if we're 2 container-heights away (or less ) from the end of the data, fetch more...
      if (!this.state.loading && (rowsPast + (amountToRender * 2)) > totalRows) {
        if (this.props.onNeedMoreData) {
          this.props.onNeedMoreData();
          nextState.loading = true;
        }
      }

      if (rowsPast + amountToRender >= totalRows) {
        requestAnimationFrame(() => {
          const rowsHeight = this.rowContainer.offsetHeight;
          this.setState((oldState) => {
            const newState = oldState;
            const newAdjustment = newState.contentTop + rowsHeight;
            if (newState.adjustedHeight === null || newAdjustment > newState.adjustedHeight) {
              newState.adjustedHeight = newAdjustment;
            }
            return newState;
          });
        });
      } else if (this.state.adjustedHeight !== null) {
        nextState.adjustedHeight = null;
      }
    }

    if (currentScroll < scrollTop) {
      if (currentScroll < rowsPadding) {
        nextState.firstIndex = 0;
        nextState.contentTop = 0;
      }
    }

    this.setState({
      ...nextState,
    });

    this.headerRow.scrollLeft = e.target.scrollLeft;

    this.props.onScroll(e);
  }

  // Row logic

  measureNewRows() {
    if (this.rowContainer) { // check for ref...
      const { firstIndex, amountToRender } = this.state;
      const { contentData } = this.props;
      const c = this.rowContainer.children;
      for (let i = 0; i < amountToRender; i += 1) {
        const index = firstIndex + i;
        if (contentData[index]) {
          if (this.rowCache[index] !== 'undefined') {
            // children are c[1] to c[length-1]
            this.rowCache.push(c[index - firstIndex].offsetHeight);
          }
        }
      }
    }
  }

  updateAverageHeight() {
    let sum = 0;
    this.rowCache.forEach((l) => { sum += l; });
    const avg = sum > 0 ? sum / this.rowCache.length : 0;
    // this.averageRowHeight = avg;
    return avg;
  }

  getRowClass(rowIndex) {
    const selectedClass = this.props.selectedClass ? this.props.selectedClass : css.selected;

    return classnames(
      css.row,
      // Striped rows
      { [css.isOdd]: this.props.striped && (rowIndex % 2 === 0) },
      // Is selected
      { [`${selectedClass}`]: this.maybeSelected(this.props.selectedRow, rowIndex) },
      // whether the table contains interactive rows
      { [css.isInteractive]: this.props.interactive },
    );
  }

  handleRowClick(e, row) {
    if (Object.prototype.hasOwnProperty.call(this.props, 'onRowClick')) {
      e.preventDefault();
      this.props.onRowClick(e, row);
    }
  }

  maybeSelected(criteria, rowIndex) {
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
          console.warn(`Formatter possibly needed for column '${col}': value is object`, value); // eslint-disable-line no-console
          stringValue = null;
        }
      }

      if (typeof value === 'boolean') {
        value = value ? (<span>&#10003;</span>) : '';
        stringValue = value ? 'yes' : 'no';
      }

      const cellWidth = columnWidths[col];
      let cellStyle;
      if (typeof cellWidth === 'number') {
        cellStyle = { flex: `0 0 ${cellWidth}px` };
      } else {
        cellStyle = { flex: `0 0 ${cellWidth}`, width: `${cellWidth}` };
      }

      const showOverflow = (columnOverflow[col]) ? css.showOverflow : '';
      cells.push((
        <div
          role="gridcell"
          key={`${col}-${rowIndex}`}
          className={`${css.cell} ${showOverflow}`}
          style={cellStyle}
          title={stringValue}
        >
          {value}
        </div>
      ));

      labelStrings.push(`${this.getMappedColumnName(col)}: ${stringValue}`);
    });

    return { cells, labelStrings };
  }

  // Column Logic

  getMappedColumnName(column) {
    const { columnMapping } = this.props;
    if (!columnMapping) {
      return column;
    }

    if (Object.prototype.hasOwnProperty.call(columnMapping, column)) {
      return columnMapping[column];
    }

    return column;
  }

  getHeaderClassName(column) {
    const isSortHeader = (this.props.sortOrder === this.getMappedColumnName(column) ||
      this.props.sortedColumn === this.getMappedColumnName(column));

    return classnames(
      css.header,
      { [`${css.clickable}`]: (Object.prototype.hasOwnProperty.call(this.props, 'onHeaderClick')) },
      { [`${css.sorted}`]: isSortHeader },
      { [`${css.ascending}`]: (isSortHeader && this.props.sortDirection === 'ascending') },
      { [`${css.descending}`]: (isSortHeader && this.props.sortDirection === 'descending') },
    );
  }

  handleHeaderClick(e, name) {
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
  }

  generateHeaders() {
    const { columnWidths } = this.state;
    const headers = [];
    this.state.columns.forEach((header, i) => {
      const headerWidth = columnWidths[header];
      let columnId;
      let clickableId;
      if (header === ' ') {
        columnId = `list-column-${i}`;
        clickableId = `clickable-list-column-${i}`;
      } else {
        columnId = `list-column-${header.replace(/\s/g, '').toLowerCase()}`;
        clickableId = `clickable-list-column-${header.replace(/\s/g, '').toLowerCase()}`;
      }

      let headerStyle;
      if (typeof headerWidth === 'number') {
        headerStyle = { flex: `0 0 ${headerWidth}px` };
      } else {
        headerStyle = { flex: `0 0 ${headerWidth}`, width: `${headerWidth}` };
      }

      headers.push(
        <div key={`header-${header}`} role="columnheader" className={this.getHeaderClassName(header)} style={headerStyle} id={columnId}>
          <div role="presentation" onClick={(e) => { this.handleHeaderClick(e, header); }} id={clickableId} >
            {this.getMappedColumnName(header)}
          </div>
        </div>,
      );
    });
    return headers;
  }

  initColumnsFromData(contentData) {
    // const {headerMetadata, rowMetadata, ...rest} = this.props;
    let data = contentData;
    if (!data) { data = this.props.contentData; }
    const columns = [];

    Object.keys(data[0]).forEach((header) => {
      // by default, hide rowMetadata and headerMetadata
      const hind = this.props.headerMetadata ? this.props.headerMetadata.indexOf(header) : -1;
      const rind = this.props.rowMetadata ? this.props.rowMetadata.indexOf(header) : -1;
      if (hind === -1 && rind === -1) {
        columns.push(header);
      }
    });

    return columns;
  }

  measureColumns({ data, columns, colWidths } = {}) {
    let contentData = data;
    let cols = columns;
    let columnWidths = colWidths;

    if (!data) { contentData = this.props.contentData; }
    if (!columns) { cols = this.state.columns; }
    if (!colWidths) { columnWidths = this.props.columnWidths; }
    const { formatter } = this.props;
    const cellWidths = {};
    const cellPadding = 28;
    const charWidth = 9;

    cols.forEach((colName) => {
      if (typeof columnWidths !== 'undefined' && Object.prototype.hasOwnProperty.call(columnWidths, colName)) {
        cellWidths[colName] = columnWidths[colName];
      } else {
        // Measure column string contents...
        const charLengthArray = [];
        const headerWidth = (colName.length * charWidth * 0.7) + cellPadding;
        contentData.forEach((row, i) => {
          let charLength = 25; // minimal char length
          if (Object.prototype.hasOwnProperty.call(formatter, colName)) {
            const res = formatter[colName]({ ...row, rowIndex: i });
            if (typeof res === 'string') {
              charLength = res.length;
            } else if (typeof res === 'number') {
              charLength = res.toString().length;
            } else if (typeof res === 'boolean') {
              charLength = 3;
            } else if (React.isValidElement(res)) {
              // console.log(res);
            }
          } else {
            charLength = row[colName].toString().length;
          }
          if (charLength > 0) {
            charLengthArray.push(charLength);
          }
        });
        // getAverage width..
        let sum = 0;
        let width = 0;
        charLengthArray.forEach((len) => { sum += len; });
        if (sum !== 0 || charLengthArray.length !== 0) {
          const avg = sum / charLengthArray.length;
          width = (avg * charWidth) + cellPadding; // character width and cell padding
          if (width < headerWidth) {
            width = headerWidth;
          }
        } else {
          width = headerWidth;
        }
        cellWidths[colName] = width;
      }
    });

    return cellWidths;
  }

  // Calculate row width based on accumulated column widths
  getRowWidth() {
    const { columnWidths } = this.state;

    if (typeof columnWidths !== 'object') {
      return false;
    }

    return Math.floor(Object.keys(columnWidths).reduce((acc, key) => (acc + columnWidths[key]), 0));
  }

  serveContainerRef(ref) {
    if (this.props.containerRef) {
      this.props.containerRef(ref);
    }
    this.container = ref;
  }

  selectPreviousRow = (e) => {
    if (this.focusedRow !== null && this.focusedRow !== 0) {
      this.focusedRow = this.focusedRow - 1;
      this.handleRowClick(e, this.props.contentData[this.focusedRow], this.props.rowMetadata);
    }
  }

  selectNextRow = (e) => {
    if (this.focusedRow !== null && this.focusedRow !== this.props.contentData.length - 1) {
      this.focusedRow = (this.focusedRow === null) ? 0 : this.focusedRow + 1;
      this.handleRowClick(e, this.props.contentData[this.focusedRow], this.props.rowMetadata);
    }
  }

  selectFirstOrCurrentRow(e) {
    if (e.target === this.container) {
      this.rowContainer.firstChild.focus();
    } else if (this.focusedRow !== null) {
      this.handleRowClick(e, this.props.contentData[this.focusedRow], this.props.rowMetadata);
    }
  }

  unFocusRow() {
    if (this.focusedRow !== null) {
      this.container.focus();
    }
  }

  focusBeyond() {
    const elem = getNextFocusable(this.container, false);
    elem.focus();
  }

  getContainerStyle() {
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
  }

  getBodyStyle() {
    const bodyStyle = {};
    // body will be scrollable if constrained in any way...
    if (this.props.autosize || this.props.height || this.props.maxHeight) {
      bodyStyle.overflow = 'auto';
    }
    // if height is explicit, body height will be the remainder of the container aside from the header
    if (this.props.height) {
      bodyStyle.height = this.props.height - this.headerHeight;
    }

    // if we've only got a maxHeight to work with, the body max-height property will be set...
    if (this.props.maxHeight && !this.props.height) {
      bodyStyle.maxHeight = this.props.maxHeight - this.headerHeight;
    }

    if (this.props.virtualize) {
      bodyStyle.maxHeight = this.props.maxHeight || 'none';
    }

    bodyStyle.width = this.props.width || '100%';

    return bodyStyle;
  }

  getHeaderStyle() {
    if (this.scrollContainer) {
      const element = this.scrollContainer;
      if (element.offsetHeight < element.scrollHeight ||
        element.offsetWidth < element.scrollWidth) {
        return classnames(
          { [`${css.headerRow}`]: !this.props.headerRowClass },
          this.props.headerRowClass,
          `${css.headerForScrollable}`,
        );
        // return `${css.headerRow} ${css.headerForScrollable}`;
      }
    }
    return classnames(
      { [`${css.headerRow}`]: !this.props.headerRowClass },
      this.props.headerRowClass,
    );
  }

  render() {
    const { firstIndex, amountToRender, columnWidths, columns } = this.state;
    const { contentData, isEmptyMessage, rowMetadata, width, columnMapping, interactive } = this.props;

    // if contentData is empty, render empty message...
    if (contentData.length === 0) {
      return (
        <div className={css.emptyMessage} style={{ minWidth: this.props.width || '200px' }} ref={this.serveContainerRef}>
          { typeof isEmptyMessage === 'string' ? <EmptyMessage>{isEmptyMessage}</EmptyMessage> : isEmptyMessage }
        </div>
      );
    }

    const renderedRows = [];

    // Add row width to prevent some styling issues
    const rowWidth = this.getRowWidth();
    const defaultStyle = (rowWidth) ? { minWidth: `${rowWidth}px` } : null;

    for (let i = 0; i < amountToRender; i += 1) {
      const rowIndex = firstIndex + i;
      if (contentData[rowIndex]) {
        const defaultRowProps = {
          onClick: (e) => { this.handleRowClick(e, contentData[rowIndex], rowMetadata); },
          onFocus: () => { this.focusedRow = rowIndex; },
          onBlur: () => { this.focusedRow = null; },
          style: defaultStyle,
        };
        const cellObject = this.renderCells(rowIndex);
        const cells = cellObject.cells;
        const labelStrings = cellObject.labelStrings;
        const rowClass = this.getRowClass(rowIndex);
        const rowProps = Object.assign(defaultRowProps, this.props.rowProps);
        const injectedRowProps = {
          rowIndex,
          rowClass,
          rowData: this.props.contentData[rowIndex],
          cells,
          rowProps,
          width,
          columnWidths,
          columns,
          columnMapping,
          labelStrings,
          interactive,
        };

        renderedRows.push(this.props.rowFormatter(injectedRowProps));
      }
    }

    const renderedHeaders = this.generateHeaders();
    return (
      <HotKeys handlers={this.handlers} noWrapper>
        <div
          style={this.getContainerStyle()}
          tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
          id={this.props.id}
          ref={this.serveContainerRef}
          aria-label={`${this.props.ariaLabel} with ${this.state.columns.length} columns`}
          role="list"
          className={css.mclContainer}
        >
          <div
            className={this.getHeaderStyle()}
            ref={(ref) => { this.headerRow = ref; }}
            onScroll={this.handleHeaderScroll}
          >
            {renderedHeaders}
          </div>
          <div
            className={css.scrollable}
            style={this.getBodyStyle()}
            onScroll={this.props.virtualize ? this.handleInfiniteScroll : this.handleFiniteScroll}
            ref={(ref) => { this.scrollContainer = ref; }}
          >
            {this.props.virtualize &&
              <div className={css.heightSpacer} style={{ height: this.state.adjustedHeight || this.state.totalRows * this.state.averageRowHeight }}>
                <div className={css.rowContainer} role="group" style={{ top: this.state.contentTop }} ref={(ref) => { this.rowContainer = ref; this.measureNewRows(); }}>
                  {renderedRows}
                </div>
              </div>
            }
            {!this.props.virtualize &&
              renderedRows
            }

          </div>
          {
            this.props.loading &&
            <div className={css.contentLoadingRow}>
              <div className={css.contentLoading}>
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
