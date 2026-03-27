// @ts-nocheck
import React from "react";
import css from "./FilterControlGroup.css";
type FilterControlGroupProps = {
  children?: React.ReactNode[] | React.ReactNode;
  label?: string;
  style?: Record<string, any>;
};

const FilterControlGroup = (props: FilterControlGroupProps) => {
  return (
    <ul
      data-test-filter-control-group
      style={props.style}
      className={css.filterList}
      aria-label={props.label}
    >
      {React.Children.map(props.children, (child) => (
        <li key={child.id} className={css.listItem}>
          {child}
        </li>
      ))}
    </ul>
  );
};

export default FilterControlGroup;
