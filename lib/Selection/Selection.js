import React, { useState, useRef, useMemo } from "react";
import {
  defaultItemToString,
  reduceOptions,
  filterOptionList,
  getSelectedObject,
} from "./utils";
import { useIntl } from 'react-intl';
import { useCombobox } from "downshift";
import classNames from 'classnames';
import SelectionOverlay from "./SelectionOverlay";

import Label from '../Label';
import TextFieldIcon from '../TextField/TextFieldIcon';
import useProvidedRefOrCreate from '../../hooks/useProvidedRefOrCreate'
import formStyles from '../sharedStyles/form.css';
import css from './Selection.css';

const getControlWidth = (control) => {
  if (control) {
    return control.offsetWidth;
  }
}

const Selection = ({
  asyncFilter,
  autofocus,
  dataOptions,
  dirty,
  error,
  id,
  inputRef,
  value,
  onChange,
  placeholder,
  label,
  listMaxHeight = '174px',
  loading,
  loadingMessage,
  marginBottom0,
  onFilter = filterOptionList,
  optionAlignment,
  popper,
  useValidStyle = false,
  valid,
  warning,
  ...rest
}) => {
  const { formatMessage } = useIntl();
  const [filterValue, updateFilter] = useState("");
  const controlRef = useProvidedRefOrCreate(inputRef);
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
    selectedItem: getSelectedObject(value, dataOptions),
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      if (onChange) onChange(defaultItemToString(newSelectedItem));
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
      {label && <Label {...getLabelProps()}>{label}</Label>}
      <div className={css.selectionControlContainer}>
        <button type="button" {...getToggleButtonProps({ ref: controlRef, tabIndex: undefined })} className={getControlClass()}>
          <span className="sr-only">{formatMessage({ id: 'stripes-components.selection.controlLabel' })}</span>
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
        filterValue={filterValue}
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
        getInputProps={getInputProps}
        highlightedIndex={highlightedIndex}
        id={id}
        items={reducedListItems}
        isOpen={isOpen}
        label={label}
        listMaxHeight={listMaxHeight}
        loading={loading}
        loadingMessage={loadingMessage}
        onChangeFilterValue={updateFilter}
        width={getControlWidth(controlRef.current)}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default Selection;
