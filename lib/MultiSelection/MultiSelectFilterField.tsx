// @ts-nocheck
import React from "react";
import noop from "lodash/noop";
import css from "./MultiSelect.css";
type MultiSelectFilterFieldProps = {
  ariaLabelledBy?: string;
  disabled?: boolean;
  filterValue?: string;
  getDropdownProps?: (...args: any[]) => any;
  getInputProps?: (...args: any[]) => any;
  id?: string;
  inputRef?: Record<string, any>;
  menuId?: string;
  onBlur?: (...args: any[]) => any;
  onFocus?: (...args: any[]) => any;
  placeholder?: string;
  setFilterFocus?: (...args: any[]) => any;
  setFilterValue?: (...args: any[]) => any;
};

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
}: MultiSelectFilterFieldProps) => {
  return (
    <input
      {...getInputProps(
        getDropdownProps({
          "aria-labelledby": ariaLabelledBy,
          "aria-controls": menuId,
          value: filterValue,
          type: "text",
          ref: inputRef,
          onFocus: (e) => {
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
        }),
      )}
    />
  );
};

export default MultiSelectFilterField;
