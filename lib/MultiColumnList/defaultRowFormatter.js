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

  // the aria-rowindex property should be greater than 1
  // header row included in the count,
  // So its aria-rowindex is set to rowIndex + 2.
  return (
    <Element
      key={`row-${rowIndex}`}
      className={rowClass}
      data-label={labelStrings.join('...')}
      aria-rowindex={rowIndex + 2}
      role="row"
      {...rowProps}
      tabIndex="0"
    >
      {cells}
    </Element>
  );
}

defaultRowFormatter.propTypes = propTypes;

export default defaultRowFormatter;
