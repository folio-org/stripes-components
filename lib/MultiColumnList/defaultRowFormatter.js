import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isFunction } from 'lodash';

const propTypes = {
  cells: PropTypes.arrayOf(PropTypes.element),
  labelStrings: PropTypes.oneOf([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  rowClass: PropTypes.string,
  rowData: PropTypes.object,
  rowIndex: PropTypes.number,
  rowProps: PropTypes.object,
  rowWidth: PropTypes.number,
};

function defaultRowFormatter(row) {
  const {
    rowIndex,
    rowClass,
    rowData,
    cells,
    rowProps: initialRowProps,
    labelStrings: initialLabelStrings,
  } = row;

  // Default row element
  const rowProps = { ...initialRowProps };
  let Element = 'div';

  // Render a <Link> if a "to"-prop is provided (react-router API)
  if (rowProps.to) {
    Element = Link;

    if (isFunction(rowProps.to)) {
      rowProps.to = rowProps.to(rowData.id);
    }
  }

  // Render an anchor tag if an "href"-prop is provided
  if (rowProps.href) {
    Element = 'a';

    if (isFunction(rowProps.href)) {
      rowProps.href = rowProps.href(rowData.id);
    }
  }

  const labelStrings = isFunction(rowProps.labelStrings)
    ? rowProps.labelStrings(row)
    : initialLabelStrings;

  delete rowProps.labelStrings; // We don't want to spread this onto the DOM element.

  return (
    <Element
      key={`row-${rowIndex}`}
      className={rowClass}
      aria-label={labelStrings.join('...')}
      tabIndex="0"
      {...rowProps}
    >
      {cells}
    </Element>
  );
}

defaultRowFormatter.propTypes = propTypes;

export default defaultRowFormatter;
