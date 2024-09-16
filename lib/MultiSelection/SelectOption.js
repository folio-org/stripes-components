import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './MultiSelect.css';

const SelectOption = forwardRef((props, ref) => {
  function getClassName() {
    return classnames(
      css.multiSelectOption,
      { [`${css.optionCursor}`]: props.isActive },
      { [`${css.optionSelected}`]: props.isSelected },
      { [`${css.optionDisabled}`]: props.isDisabled },
    );
  }

  const {
    children,
    isSelected,
    isActive, // eslint-disable-line
    isDisabled, // eslint-disable-line
    optionItem,  // eslint-disable-line
    ...rest
  } = props;

  if (React.Children.count(children) !== 0) {
    return (
      <li role="option" ref={ref} key={props.id} className={getClassName()} {...rest} aria-selected={isSelected}>
        {children}
        <div>{isSelected ? '-' : '+'}</div>
      </li>
    );
  }

  return null;
});

SelectOption.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isSelected: PropTypes.bool,
};

export default SelectOption;
