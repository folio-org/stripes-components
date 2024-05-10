import React, { useState, useRef, useMemo } from "react";
import {
  defaultItemToString,
  reduceOptions,
  filterOptionList,
} from "./utils";
import { useCombobox } from "downshift";
import classNames from 'classnames';
import SelectionOverlay from "./SelectionOverlay";

import Label from '../Label';
import TextFieldIcon from '../TextField/TextFieldIcon';

import formStyles from '../sharedStyles/form.css';
import css from './Selection.css';


const getControlWidth = (control) => { // eslint-disable-line consistent-return
  if (control) {
    return control.offsetWidth;
  }
}

const Selection = ({
  asyncFilter,
  dirty,
  error,
  id,
  value,
  onChange,
  placeholder,
  label,
  dataOptions,
  marginBottom0,
  onFilter = filterOptionList,
  useValidStyle = false,
  valid,
  warning,
  ...rest
}) => {
  const [filterValue, updateFilter] = useState("");
  const controlRef = useRef(null);
  const options = useMemo(
    () => (asyncFilter ? dataOptions : onFilter(filterValue, dataOptions)),
    [asyncFilter, filterValue]
  );

  // we need to skip over group headings since those can neither be selectable or cursored over.
  const reducedListItems = reduceOptions(options);
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getInputProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: reducedListItems,
    itemToString: defaultItemToString,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      if (onChange) onChange(newSelectedItem);
    },
  });
  const valueLabel = selectedItem?.label || placeholder || "";

  const getControlClass = () => {
    let validationClasses = '';
    validationClasses = classNames(
      { [`${formStyles.hasFeedback}`]: error || warning },
      { [`${formStyles.hasWarning}`]: warning },
      { [`${formStyles.hasError}`]: error },
      { [`${formStyles.isChanged}`]: dirty },
      {
        [`${formStyles.isValid}`]:
          useValidStyle &&
          valid &&
          !error &&
          !warning
      },
    );

    return classNames(
      validationClasses,
      css.selectionControl,
      formStyles.formControl,
      { [`${css.marginBottom0}`]: marginBottom0 },
    );
  }

  return (
    <div>
      {label && <Label {...getLabelProps}>{label}</Label>}
      <div className={css.selectionControlContainer}>
        <button type="button" {...getToggleButtonProps({ ref: controlRef, tabIndex: undefined })} className={getControlClass()}>
          {valueLabel}
        </button>
        <div className={css.selectionEndControls}>
          <TextFieldIcon icon="triangle-down" />
        </div>
      </div>
      <SelectionOverlay
        {...rest}
        controlRef={controlRef}
        filteredOptions={options}
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
        getInputProps={getInputProps}
        highlightedIndex={highlightedIndex}
        id={id}
        items={reducedListItems}
        isOpen={isOpen}
        label={label}
        filterValue={filterValue}
        onChangeFilterValue={updateFilter}
        width={getControlWidth(controlRef.current)}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default Selection;
