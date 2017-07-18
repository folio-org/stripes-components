import React from 'react';

// {rowIndex, rowClass, rowData, cells, rowProps}
export default function defaultRowFormatter(
  { rowIndex,
    rowClass,
    rowData,
    cells,
    rowProps,
    width,
    columnWidths,
    columns,
    columnMapping,
    labelStrings,
  },
) {
  return (
    <div
      key={`row-${rowIndex}`}
      className={rowClass}
      aria-label={labelStrings.join('...')}
      role="listitem"
      {...rowProps}
      tabIndex="0"
    >
      {cells}
    </div>
  );
}
