import React from "react";
import css from './MultiSelect.css';
import classnames from "classnames";

const SelectOption = props => {
  function getClassName() {
    return classnames(
      css.multiSelectOption,
      { [`${css.optionCursor}`]: props.isActive },
      { [`${css.optionSelected}`]: props.isSelected},
    );
  }

  const { isActive, children, isSelected, optionItem, ...rest } = props;

  if (React.Children.count(children) !== 0 ) {
    return (
      <li key={props.id} className={getClassName()} {...rest} aria-selected={isSelected}>
        {children}
        <div>{isSelected ? "-" : "+"}</div>
      </li>
    );
  }
  
  return null;
};

export default SelectOption;
