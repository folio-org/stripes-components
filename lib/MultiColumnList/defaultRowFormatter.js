import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './MCLRenderer.css';

const propTypes = {
  rowIndex: PropTypes.number,
  rowClass: PropTypes.string,
  cells: PropTypes.arrayOf(PropTypes.element),
  rowProps: PropTypes.object,
  labelStrings: PropTypes.arrayOf(PropTypes.string),
};

function defaultRowFormatter(
  { rowIndex,
    rowClass,
    cells,
    rowProps,
    labelStrings,
  },
) {
  const isEven = (rowIndex % 2 > 0);
  return (
    <div
      key={`row-${rowIndex}`}
      className={classnames(rowClass, { [css.isEven]: isEven })}
      aria-label={labelStrings.join('...')}
      role="listitem"
      {...rowProps}
      tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
    >
      {cells}
    </div>
  );
}

defaultRowFormatter.propTypes = propTypes;

export default defaultRowFormatter;
