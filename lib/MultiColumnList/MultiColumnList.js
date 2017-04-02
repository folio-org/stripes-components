import React from 'react';
import css from './MultiColumnList.css';

/*
 * Table component that uses an object
 */

const propTypes = {
  /** Data object to render */
   contentData:React.PropTypes.arrayOf(React.PropTypes.object),
   /** Properties visible in table - order of values also defines order of columns */
   visibleColumns: React.PropTypes.arrayOf(React.PropTypes.string),
   /** Data object properties to be included with an onRowClick handler */
   rowMetadata: React.PropTypes.arrayOf(React.PropTypes.string),
   /** Data object properties to be included with an onHeaderClick handler */
   headerMetadata: React.PropTypes.object,
   /** Specific control of rendering data properties - ex, concatenate firstName and lastName properties */
   formatter: React.PropTypes.objectOf(React.PropTypes.func),
   /** object with key:value pair for selected row - ex: {'id': '1294'} */
   selectedRow: React.PropTypes.object,
   /** assign sorted classes to column with this name */
   sortedColumn: React.PropTypes.string,
   /** nominates a column as the one by which the data are sorted: will be rendered distinctively */
   sortOrder: React.PropTypes.string,
   /** handler for row clicks */
   onRowClick: React.PropTypes.func,
   /** handler for header clicks */
   onHeaderClick: React.PropTypes.func,
   /** override for the default css class for a selected item */
   selectedClass: React.PropTypes.string,
   sortedClass: React.PropTypes.string,
   /** override for the default css class for a selected item */
   isEmptyMessage: React.PropTypes.string,
   /** table caption */
   caption: React.PropTypes.oneOf([React.PropTypes.string, React.PropTypes.element]),
   /** map column names to backend data - affects supplied arguments for onHeaderClick callback - ex: {'username': 'userId}
    * would send 'userId' to the onHeaderClick handler when the header with the name 'username' is clicked.
   */
   columnMapping: React.PropTypes.object,
};

const defaultProps = {
  contentData: [],
  selectedClass: css.selected,
  sortedClass: css.sorted,
  onHeaderClick: (e)=>null,
  onRowClick: (e)=>null,
  isEmptyMessage: "The list contains no items",
  formatter: {},
  columnMapping: {},
};

class MultiColumnList extends React.Component{
  constructor(props){
    super(props);
    
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.initColumns = this.initColumns.bind(this);
  }
  
  getTableStyle(){
    let tableStyle = css.multilist;
    this.props.fullWidth? tableStyle += " fullWidth": null;
    return tableStyle;
  }
  
  handleHeaderClick(e){
    const columnName = e.currentTarget.textContent;
    let name, alias;
    name = this.props.columnMapping[columnName] || columnName;
    alias = columnName;
    let meta = {name: name, alias: columnName};
    if(this.props.headerMetadata){
      for(let prop in this.props.headerMetadata[columnName]){
        meta[prop] = this.props.headerMetadata[columnName][prop];
      }
    }
    this.props.onHeaderClick(e, meta);
  }
  
  handleRowClick(e){
    const index = e.currentTarget.getAttribute('data-row');
    let meta = {};
    if(this.props.rowMetadata){
      this.props.rowMetadata.forEach(function(prop){
        meta[prop] = this.props.contentData[index][prop];
      }, this);
    }
    this.props.onRowClick(e, meta);
  }
  
  initColumns(){
    //const {headerMetadata, rowMetadata, ...rest} = this.props;
    let columns = [];
    for(let header in this.props.contentData[0]){
      //by default, hide rowMetadata and headerMetadata
      const hind = this.props.headerMetadata ? this.props.headerMetadata.indexOf(header) : -1;
      const rind = this.props.rowMetadata ? this.props.rowMetadata.indexOf(header) : -1;
      if(hind === -1 && rind === -1){
        columns.push(header);
      } 
    }
    return columns;
  }
  
  getSortedClass(){
    return this.props.sorted? css.sorted : '';
  }
  
  isSelected(criteria, i){
    const testItem = this.props.contentData[i];
    let selected = false;
    for(let prop in criteria){
      if(criteria[prop] === testItem[prop]){
        selected = true;
      }
    }
    return selected? this.props.selectedClass : '';
  }
  
  render(){
    const {
      contentData,
      visibleColumns,
      rowMetadata,
      headerMetadata,
      formatter,
      selectedRow,
      sortedColumn,
      sortOrder,
      onRowClick,
      onHeaderClick,
      selectedClass,
      sortedClass,
      isEmptyMessage,
      fullWidth,
      columnMapping,
      ...tableProps
    } = this.props;
    
    //if contentData is empty, render empty message...
    if(contentData.length === 0){
      return <div>{isEmptyMessage}</div>;
    }
    
    //if no visibleColumns prop specified, buid columns from object...
    let columns = visibleColumns? visibleColumns : this.initColumns();
    
    //generate headers...
    const ths = [];
    columns.forEach((header, i) => {
      ths.push(
        <th 
          style={header !== sortOrder ? {} : { 'textDecoration': 'underline' }}
          onClick={this.handleHeaderClick} 
          key={header + i}
          className={this.getSortedClass()}
        >
          {header}
        </th>);
    });
    
    //render content from contentData....
    var listItems = [];
    var columnHeaders;
    
    contentData.map(function(item, i){
      var listItem = [];

      columns.forEach(function(prop){
        let cell;
        //create value cells...if prop has a formatter, use the formatter
        
        if(formatter.hasOwnProperty(prop)){
          cell = formatter[prop](item);
          if(cell === undefined) {
            console.warn(`[MultiColumnList] formatter for property '${prop}' could not format`, item);
          }
          if (cell === true) cell = '✓';
          // If a simple value is returned, promote it to a table-cell
          if (typeof cell !== 'object') cell = <td key={prop}>{cell}</td>;
        }else{
          let val = item[prop];
          if(typeof(val) === 'object'){
            throw `prop ${prop} is an object, suggest using a formatter to handle it`;
          }
          if (val === true) val = '✓';
          cell = <td key={prop}>{val}</td>;
        }
        
        listItem.push(cell);  
      });

      //assemble rows...
      listItems.push(<tr key={i} data-row={i} className={this.isSelected(selectedRow, i)} onClick={this.handleRowClick}>{listItem}</tr>);
      
      //assemble header row
      columnHeaders = <tr>{ths}</tr>;
    }, 
    this);
    
    return(
      <div>
        <table className={this.getTableStyle()} {...tableProps}>
          <thead>
            {columnHeaders}
          </thead>
          <tbody>
            {listItems}
          </tbody>
        </table>
      </div>
    );
  }
}

MultiColumnList.propTypes = propTypes;
MultiColumnList.defaultProps = defaultProps;

export default MultiColumnList;
