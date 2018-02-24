import React from 'react';
import PropTypes from 'prop-types';
import AccessibleFocus from '../AccessibleFocus';

const propTypes = {
  rowIndex: PropTypes.number,
  rowWidth: PropTypes.number,
  rowClass: PropTypes.string,
  cells: PropTypes.arrayOf(PropTypes.element),
  rowProps: PropTypes.object,
  labelStrings: PropTypes.arrayOf(PropTypes.string),
};

function defaultRowFormatter({ rowIndex, rowClass, cells, rowProps, labelStrings }) {
  return (
    <AccessibleFocus
      tag={(rowProps.onClick || rowProps.href) ? 'a' : 'div'}
      focusDot

      key={`row-${rowIndex}`}
      className={rowClass}
      aria-label={labelStrings.join('...')}
      role="listitem"
      {...rowProps}
      tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
    >
      {cells}
    </AccessibleFocus>
  );
}

defaultRowFormatter.propTypes = propTypes;

export default defaultRowFormatter;
