import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import css from './MultiSelect.css';

const MultiSelectFilterField = ({
  ariaLabelledBy,
  getDropdownProps,
  getInputProps,
  onFocus: onFocusProp = noop,
  onBlur: onBlurProp = noop,
  placeholder,
  id,
  inputRef,
  disabled,
  filterValue,
  menuId,
  setFilterValue,
  setFilterFocus,
}) => {
  return (
    <input
      {...getInputProps(
        getDropdownProps({
          'aria-labelledby': ariaLabelledBy,
          'aria-controls': menuId,
          value: filterValue,
          type: 'text',
          ref: inputRef,
          onFocus : (e) => {
            setFilterFocus(true);
            onFocusProp(e);
          },
          onBlur: (e) => {
            setFilterFocus(false);
            onBlurProp(e);
          },
          placeholder,
          className: css.multiSelectFilterField,
          disabled,
          onClick: (e) => e.stopPropagation(),
          onChange: (e) => setFilterValue(e.target.value),
          preventKeyAction: true,
          id,
        })
      )}
    />
  );
}

MultiSelectFilterField.propTypes = {
  ariaLabelledBy: PropTypes.string,
  disabled: PropTypes.bool,
  filterValue: PropTypes.string,
  getDropdownProps: PropTypes.func,
  getInputProps: PropTypes.func,
  id: PropTypes.string,
  inputRef: PropTypes.object,
  menuId: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  setFilterFocus: PropTypes.func,
  setFilterValue: PropTypes.func,
};

export default MultiSelectFilterField;
