import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const propTypes = {
  rowIndex: PropTypes.number,
  rowWidth: PropTypes.number,
  rowClass: PropTypes.string,
  cells: PropTypes.arrayOf(PropTypes.element),
  rowProps: PropTypes.object,
  labelStrings: PropTypes.arrayOf(PropTypes.string),
};

function defaultRowFormatter({ rowIndex, rowClass, cells, rowProps, labelStrings }) {
  // Default row element
  let Element = 'div';

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
  }

  // Render a div if the row itself isn't clickable
  // E.g. if there's action buttons or links inside the row columns
  if (!rowProps.interactive) {
    Element = 'div';
  }

  return (
    <Element
      key={`row-${rowIndex}`}
      className={rowClass}
      aria-label={labelStrings.join('...')}
      role="listitem"
      {...rowProps}
      tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
    >
      {cells}
    </Element>
  );
}

defaultRowFormatter.propTypes = propTypes;

export default defaultRowFormatter;
