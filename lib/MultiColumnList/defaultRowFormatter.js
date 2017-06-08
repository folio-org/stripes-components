import React from 'react';

// {rowIndex, rowClass, rowData, cells, rowProps}
export default function defaultRowFormatter(
  { rowIndex, 
    rowClass, 
    rowData, 
    cells, 
    rowProps
  }
){
  return (
    <div 
      key={`row-${rowIndex}`} 
      className={rowClass} 
      {...rowProps}
      tabIndex="0"
    >
      {cells}
    </div>
  );
};