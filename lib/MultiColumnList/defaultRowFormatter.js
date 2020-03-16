import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const propTypes = {
  cells: PropTypes.arrayOf(PropTypes.element),
  labelStrings: PropTypes.arrayOf(PropTypes.string),
  rowClass: PropTypes.string,
  rowIndex: PropTypes.number,
  rowProps: PropTypes.object,
  rowWidth: PropTypes.number,
};

function defaultRowFormatter({ rowIndex, rowClass, cells, rowProps, labelStrings }) {
  // Default row element
  let Element = 'div';
  let role = 'row';

  // Render a <Link> if a "to"-prop is provided (react-router API)
  if (rowProps.to) {
    Element = Link;
  }

  // Render an anchor tag if an "href"-prop is provided
  if (rowProps.href) {
    Element = 'a';
  }

  // Render a button if an "onClick"-prop is provided
  if (rowProps.onClick) {
    Element = 'button';
    role = 'button';
  }

  return (
    <Element
      key={`row-${rowIndex}`}
      className={rowClass}
      aria-label={labelStrings.join('...')}
      role={role}
      {...rowProps}
      tabIndex="0"
    >
      {cells}
    </Element>
  );
}

defaultRowFormatter.propTypes = propTypes;

export default defaultRowFormatter;
