import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  cells: PropTypes.arrayOf(PropTypes.element),
  rowClass: PropTypes.string,
  rowIndex: PropTypes.number,
  rowProps: PropTypes.object,
};

/* Default rowFormatter for MCLGrid. Receives the same shape of props as the legacy
 * defaultRowFormatter (minus link rendering - rows that navigate should use onRowClick),
 * so a custom `rowFormatter` can wrap or replace it. Rows are always a plain element with
 * role="row"; `rowProps` carries the grid's handlers and aria/data attributes.
 */
function gridRowFormatter({ cells, rowClass, rowIndex, rowProps }) {
  return (
    <div
      key={`row-${rowIndex}`}
      role="row"
      className={rowClass}
      {...rowProps}
    >
      {cells}
    </div>
  );
}

gridRowFormatter.propTypes = propTypes;

export default gridRowFormatter;
