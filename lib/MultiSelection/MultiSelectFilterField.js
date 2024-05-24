import React from 'react';
import PropTypes from 'prop-types';
import css from './MultiSelect.css';
import noop from 'lodash/noop';

const MultiSelectFilterField = ({
  ariaLabelledBy,
  getDropdownProps,
  getInputProps,
  onFocus: onFocusProp = noop,
  onBlur: onBlurProp = noop,
  placeholder,
  inputRef,
  disabled,
  filterValue,
  menuId,
  setFilterValue,
  setFilterFocus,
  ...rest
}) => {
    return (
      <input
        {...getInputProps(
          getDropdownProps({
            'aria-labelledby': rest['aria-labelledby'] || ariaLabelledBy,
            'aria-controls': menuId,
            value: filterValue,
            'type': 'text',
            'ref': inputRef,
            onFocus : (e) => {
              setFilterFocus(true);
              onFocusProp(e);
            },
            onBlur: (e) => {
              setFilterFocus(false);
              onBlurProp(e);
            },
            placeholder,
            'className': css.multiSelectFilterField,
            disabled,
            onClick: (e) => e.stopPropagation(),
            onChange: (e) => setFilterValue(e.target.value),
          })
        )}
      />
    );
  }

MultiSelectFilterField.propTypes = {
  ariaLabelledBy: PropTypes.string,
  atSmallMedia: PropTypes.bool,
  backspaceDeletes: PropTypes.bool,
  disabled: PropTypes.bool,
  getInputProps: PropTypes.func,
  inputRef: PropTypes.object,
  internalChangeCallback: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onRemove: PropTypes.func,
  optionsLength: PropTypes.number,
  placeholder: PropTypes.string,
  removeItem: PropTypes.func,
  selectedItems: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.object)
  ]),
  setHighlightedIndex: PropTypes.func,
  setFilterFocus: PropTypes.func,
  setFilterValue: PropTypes.func,
};

export default MultiSelectFilterField;
