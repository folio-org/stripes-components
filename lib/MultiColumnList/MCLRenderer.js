import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';

import Icon from '../Icon';
import EmptyMessage from '../EmptyMessage';
import Layout from '../Layout';
import { HotKeys } from '../HotKeys';
import getNextFocusable from '../../util/getNextFocusable';
import css from './MCLRenderer.css';
import defaultRowFormatter from './defaultRowFormatter';

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
      endOfListHeight: null,
      minimumRowHeight: 24,
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
    // if by some mysterious occurrence we actually have data when we mount...
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
      const dimensions = this.updateDimensions(this.props.height, this.props.contentData);
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

  componentWillReceiveProps(nextProps) { // eslint-disable-line react/no-deprecated
    const { columns } = this.state;
    let newState = {};

    // sync number of rows...
    if (nextProps.contentData.length !== this.props.contentData.length) {
      newState.totalRows = nextProps.contentData.length;
      newState.loading = false;

      // if we just received data for the first time or after reset...
      if (this.props.contentData.length === 0) {
        newState.columns =
          nextProps.visibleColumns
            ? nextProps.visibleColumns
            : this.initColumnsFromData(nextProps.contentData);
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
      newState.columnWidths = this.measureColumns({ columns: nextProps.visibleColumns });
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
          const dimensions = this.updateDimensions(this.props.height, this.props.contentData);
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

    if (this.props.virtualize) {
      const endOfListHeight = this.endOfListRef ? this.endOfListRef.offsetHeight : 0;

      if (endOfListHeight !== this.state.endOfListHeight) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ endOfListHeight });
      }
    }

    // commenting for now. FocusRowElement was originally found using refs - unreliable.
    // if (this.focusRowElement !== null && this.focusRowElement !== document.activeElement) {
    //   if (document.activeElement === this.container || contains(this.container, document.activeElement)) {
    //     this.focusRowElement.focus();
    //     this.focusRowElement = null;
    //   }
    // }
  }

  updateDimensions = (height, data) => {
    // Base-case to avoid a catastrophic divide-by-zero during a re-render.
    const minimumRowHeight = this.state.minimumRowHeight;

    // if we don't have a height, then we'll just render whatever data we have...
    let newAmount;
    if (!height) {
      newAmount = data.length;
    } else {
      newAmount = parseInt(height / minimumRowHeight, 10) + (this.state.overscanRows * 2);
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
  };

  backToTop = () => {
    this.rowCache = [];
    this.scrollContainer.scrollTop = 0;
    this.setState({
      firstIndex: 0,
      contentTop: 0,
      scrollTop: 0,
      adjustedHeight: null,
    });
  };

  setEndOfListOffset = () => {
    if (this.endOfListRef) {
      this.endOfListRef.style.left = `${this.scrollContainer.scrollLeft}px`;
    }
  };

  handleFiniteScroll = (e) => {
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

    this.setEndOfListOffset();
    this.props.onScroll(e);
  };

  handleInfiniteScroll = (e) => {
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

    this.setEndOfListOffset();
    this.props.onScroll(e);
  };

  // Row logic

  measureNewRows = () => {
    if (this.rowContainer) { // check for ref...
      const { firstIndex, amountToRender } = this.state;
      const { contentData } = this.props;
      const c = this.rowContainer.children;
      for (let i = 0; i < amountToRender; i += 1) {
        const index = firstIndex + i;
        if (contentData[index]) {
          if (!this.rowCache[index]) {
            // children are c[1] to c[length-1]
            this.rowCache.push(c[index - firstIndex].offsetHeight);
          }
        }
      }
    }
  };

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

      const cellWidth = columnWidths[col];
      let cellStyle;
      if (typeof cellWidth === 'number') {
        cellStyle = { flex: `0 0 ${cellWidth}px` };
      } else {
        cellStyle = { flex: `0 0 ${cellWidth}`, width: `${cellWidth}` };
      }

      const showOverflow = (columnOverflow[col]) ? css.mclShowOverflow : '';
      cells.push((
        <div
          role="gridcell"
          key={`${col}-${rowIndex}`}
          className={`${css.mclCell} ${showOverflow}`}
          style={cellStyle}
        >
          {value}
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

  generateHeaders = () => {
    const { columnWidths, columns } = this.state;
    const { onHeaderClick, sortDirection, sortOrder, sortedColumn } = this.props;
    const headers = [];

    columns.forEach((header, i) => {
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

      const isSortHeader = (sortOrder === header || sortedColumn === header);

      let headerInner = this.getMappedColumnName(header);
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
          { headerInner }
        </div>
      );
    });
    return headers;
  };

  initColumnsFromData = (contentData) => {
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
  };

  measureColumns = ({
    data: contentData = this.props.contentData,
    columns = this.state.columns,
    columnWidths = this.props.columnWidths,
  } = {}) => {
    const { formatter } = this.props;
    const cellWidths = {};
    const cellPadding = 28;
    const charWidth = 9;

    columns.forEach((colName) => {
      if (typeof columnWidths !== 'undefined' &&
          Object.prototype.hasOwnProperty.call(columnWidths, colName)) {
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
            charLength = (row[colName] || '').toString().length;
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
  };

  // Calculate row width based on accumulated column widths
  getRowWidth = () => {
    const { columnWidths } = this.state;

    if (typeof columnWidths !== 'object') {
      return false;
    }

    return Math.floor(Object.keys(columnWidths).reduce((acc, key) => (acc + columnWidths[key]), 0));
  };

  serveContainerRef = (ref) => {
    if (this.props.containerRef) {
      this.props.containerRef(ref);
    }
    this.container = ref;
  };

  selectPreviousRow = (e) => {
    if (this.focusedRow !== null && this.focusedRow !== 0) {
      this.focusedRow = this.focusedRow - 1;
      this.handleRowClick(e, this.props.contentData[this.focusedRow]);
    }
  };

  selectNextRow = (e) => {
    if (this.focusedRow !== null && this.focusedRow !== this.props.contentData.length - 1) {
      this.focusedRow = (this.focusedRow === null) ? 0 : this.focusedRow + 1;
      this.handleRowClick(e, this.props.contentData[this.focusedRow]);
    }
  };

  selectFirstOrCurrentRow = (e) => {
    if (e.target === this.container) {
      this.rowContainer.firstChild.focus();
    } else if (this.focusedRow !== null) {
      this.handleRowClick(e, this.props.contentData[this.focusedRow]);
    }
  };

  unFocusRow = () => {
    if (this.focusedRow !== null) {
      this.container.focus();
    }
  };

  focusBeyond = () => {
    const elem = getNextFocusable(this.container, false);
    elem.focus();
  };

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

  getBodyStyle = () => {
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
  };

  getHeaderStyle = () => {
    if (this.scrollContainer) {
      const element = this.scrollContainer;
      if (element.offsetHeight < element.scrollHeight ||
        element.offsetWidth < element.scrollWidth) {
        return classnames(
          { [`${css.mclHeaderRow}`]: !this.props.headerRowClass },
          this.props.headerRowClass,
          // `${css.mclHeaderForScrollable}`,
        );
        // return `${css.mclHeaderRow} ${css.headerForScrollable}`;
      }
    }
    return classnames(
      { [`${css.mclHeaderRow}`]: !this.props.headerRowClass },
      this.props.headerRowClass,
    );
  };

  renderEndOfList() {
    const {
      amountToRender,
      firstIndex,
    } = this.state;
    const {
      totalCount,
      width,
    } = this.props;

    const showEndOfList = totalCount && firstIndex + amountToRender >= totalCount;

    if (!showEndOfList) {
      this.endOfListRef = null;

      return null;
    }

    const endOfListWidth = Math.max(width || 0, 200);

    return (
      <div
        key="end-of-list"
        ref={(ref) => { this.endOfListRef = ref; }}
        className={css.mclEndOfList}
        style={{ width: endOfListWidth }}
      >
        <Layout className="textCentered">
          <Icon icon="end-mark">
            <FormattedMessage id="stripes-components.endOfList" />
          </Icon>
        </Layout>
      </div>
    );
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

  render() {
    const {
      firstIndex,
      amountToRender,
      columnWidths,
      columns,
    } = this.state;
    const {
      contentData,
      totalCount,
      isEmptyMessage,
      width,
      columnMapping,
      interactive,
      virtualize,
    } = this.props;

    // if contentData is empty, render empty message...
    if (contentData.length === 0) {
      return (
        <div
          className={css.mclEmptyMessage}
          style={{ minWidth: width || '200px' }}
          ref={this.serveContainerRef}
        >
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
          onClick: (e) => { this.handleRowClick(e, contentData[rowIndex]); },
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

        renderedRows.push(this.props.rowFormatter(injectedRowProps));
      }
    }

    const renderedHeaders = this.generateHeaders();
    const endOfList = this.renderEndOfList();
    const heightSpacer = (this.state.adjustedHeight || this.state.totalRows * this.state.averageRowHeight)
      + this.state.endOfListHeight;

    return (
      <HotKeys handlers={this.handlers} noWrapper>
        <div
          style={this.getContainerStyle()}
          tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
          id={this.props.id}
          ref={this.serveContainerRef}
          role="grid"
          aria-rowcount={this.getAccessibleRowCount()}
          className={css.mclContainer}
          data-total-count={totalCount}
        >
          <div
            className={this.getHeaderStyle()}
            ref={(ref) => { this.headerRow = ref; }}
            onScroll={this.handleHeaderScroll}
            role="row"
            aria-rowindex="1"
          >
            {renderedHeaders}
          </div>
          <div
            className={css.mclScrollable}
            style={this.getBodyStyle()}
            onScroll={virtualize ? this.handleInfiniteScroll : this.handleFiniteScroll}
            ref={(ref) => { this.scrollContainer = ref; }}
          >
            {virtualize &&
              <div
                className={css.mclHeightSpacer}
                style={{ height: heightSpacer }}
              >
                <div
                  className={css.mclRowContainer}
                  role="group"
                  style={{ top: this.state.contentTop }}
                  ref={(ref) => { this.rowContainer = ref; this.measureNewRows(); }}
                >
                  {renderedRows}
                  {endOfList}
                </div>
              </div>
            }
            {!virtualize &&
              [renderedRows, endOfList]
            }
            {
              this.props.loading &&
              <div className={css.mclContentLoadingRow}>
                <div className={css.mclContentLoading}>
                  <Icon icon="spinner-ellipsis" width="35px" />
                </div>
              </div>
            }
          </div>
        </div>
      </HotKeys>
    );
  }
}

MCLRenderer.propTypes = propTypes;
MCLRenderer.defaultProps = defaultProps;

export default MCLRenderer;
