import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  rowIndex: PropTypes.number,
  rowClass: PropTypes.string,
  cells: PropTypes.array,
  rowProps: PropTypes.object,
  labelStrings: PropTypes.array,
};

function defaultRowFormatter(
  { rowIndex,
    rowClass,
    cells,
    rowProps,
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

defaultRowFormatter.propTypes = propTypes;

export default defaultRowFormatter;
