// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import { isFunction } from "lodash";
type defaultRowFormatterProps = {
  cells?: React.ReactElement[];
  labelStrings?: any;
  rowClass?: string;
  rowData?: Record<string, any>;
  rowIndex?: number;
  rowProps?: Record<string, any>;
  rowWidth?: number;
};

function defaultRowFormatter(row: defaultRowFormatterProps) {
  const { rowIndex, rowClass, rowData, cells, rowProps: initialRowProps } = row;

  // Default row element
  const rowProps = { ...initialRowProps };
  let Element = "div";

  // Render a <Link> if a "to"-prop is provided (react-router API)
  if (rowProps.to) {
    Element = Link;

    if (isFunction(rowProps.to)) {
      rowProps.to = rowProps.to(rowData.id);
    }
  }

  // Render an anchor tag if an "href"-prop is provided
  if (rowProps.href) {
    Element = "a";

    if (isFunction(rowProps.href)) {
      rowProps.href = rowProps.href(rowData.id);
    }
  }

  const labelStrings = rowProps.labelStrings && rowProps.labelStrings(row);

  delete rowProps.labelStrings; // We don't want to spread this onto the DOM element.

  return (
    <Element
      key={`row-${rowIndex}`}
      className={rowClass}
      aria-label={labelStrings && labelStrings.join("...")}
      tabIndex={rowProps.onClick ? "0" : undefined}
      {...rowProps}
    >
      {cells}
    </Element>
  );
}

export default defaultRowFormatter;
