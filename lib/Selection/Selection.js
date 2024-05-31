import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useCombobox } from 'downshift';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import {
  defaultItemToString,
  reduceOptions,
  filterOptionList,
  getSelectedObject,
  flattenOptionList,
  reconcileReducedIndex
} from './utils';
import SelectionOverlay from './SelectionOverlay';

import Label from '../Label';
import TextFieldIcon from '../TextField/TextFieldIcon';
import useProvidedRefOrCreate from '../../hooks/useProvidedRefOrCreate'
import formStyles from '../sharedStyles/form.css';
import css from './Selection.css';
import DefaultOptionFormatter from './DefaultOptionFormatter';

const getControlWidth = (control) => {
  if (control) {
    return control.offsetWidth;
  }
  return undefined;
}

const getItemClass = (item, i, props) => {
  const { value } = item;
  const { selectedItem, highlightedIndex } = props;
  if (value === undefined) {
    return undefined;
  }

  return classNames(
    css.option,
    { [css.cursor]: i === highlightedIndex },
    { [`${css.selected}`]: value === selectedItem?.value },
  );
};

const getClass = ({
  dirty,
  error,
  marginBottom0,
  useValidStyle,
  valid,
  warning,
}) => {
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
};

const Selection = ({
  asyncFilter,
  autofocus,
  dataOptions,
  dirty,
  disabled,
  emptyMessage,
  error,
  formatter = DefaultOptionFormatter,
  id,
  inputRef,
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
  readOnly,
  readonly,
  required,
  useValidStyle = false,
  valid,
  value,
  warning,
  ...rest
}) => {
  const { formatMessage } = useIntl();
  const [filterValue, updateFilter] = useState('');
  const [selectedItem, updateSelected] = useState(value ? getSelectedObject(value, dataOptions) : value);
  const controlRef = useProvidedRefOrCreate(inputRef);
  const options = useMemo(
    () => (asyncFilter ? dataOptions : onFilter(filterValue, dataOptions)),
    [asyncFilter, filterValue, dataOptions, onFilter]
  );

  // we need to skip over group headings since those can neither be selectable or cursored over.
  const reducedListItems = reduceOptions(options);
  const {
    isOpen,
    getToggleButtonProps,
    getInputProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: reducedListItems,
    itemToString: defaultItemToString,
    selectedItem,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      if (onChange) onChange(defaultItemToString(newSelectedItem));
      updateSelected(newSelectedItem);
    },
    isItemDisabled(item) {
      return ((readOnly || readonly) && !isEqual(item, selectedItem));
    }
  });

  const valueLabel = selectedItem?.label || placeholder || '';

  /** renderOptions
   *  All of the rendering of the options list is performed here.
   *  This memoized function is passed into the SelectionOverlay & SelectionList
   */

  // It doesn't need to update if *all of the things it uses change...
  /* eslint-disable react-hooks/exhaustive-deps */
  const renderOptions = useCallback(() => {
    // if options are delivered with groupings, we flatten the options for
    // a set of selectable indices. Group labels are not selectable.
    const flattenedOptions = flattenOptionList(options);
    /* loading message */
    if (loading) {
      return (
        <li
          role="option"
          className={css.option}
          aria-selected="false"
        >
          <span>{loadingMessage}</span>
        </li>
      );
    }

    /* no options found through async filter */
    if (dataOptions.length === 0) {
      return (
        <li
          role="option"
          className={css.option}
          aria-selected="false"
        >
          <span>-{formatMessage({ id: 'stripes-components.selection.emptyList' })}-</span>
        </li>
      );
    }

    /* no options found through filtering */
    if (flattenedOptions.length === 0) {
      return (
        <li
          role="option"
          className={css.option}
          aria-selected="false"
        >
          <span>-{emptyMessage}-</span>
        </li>
      );
    }

    return flattenedOptions.map((item, i) => {
      if (item.value) {
        const reducedIndex = reconcileReducedIndex(item, reducedListItems);
        return (
          <li
            key={`${item.label}-option-${i}`}
            {...getItemProps({
              index: reducedIndex,
            })}
            className={getItemClass(item, reducedIndex, { selectedItem, highlightedIndex })}
          >
            {formatter({ option: item, filterValue })}
          </li>
        )
      }
      return (
        <li
          key={`${item.label}-heading-${i}`}
          className={css.groupLabel}
        >
          {formatter({ option: item, filterValue })}
        </li>
      );
    })
  }, [
    loading,
    filterValue,
    selectedItem,
    highlightedIndex,
    value,
    options,
  ]);

  const renderFilterInput = useCallback((filterRef) => (
    <div className={css.selectionFilterContainer}>
      <input
        type="text"
        {...getInputProps({
          ref: filterRef,
          value: filterValue,
        })}
        onClick={() => {}}
        onChange={(e) => updateFilter(e.target.value)}
        aria-label={formatMessage({ id: 'stripes-components.selection.filterOptionsLabel', values: { label } })}
        className={css.selectionFilter}
        placeholder={formatMessage({ id: 'stripes-components.selection.filterOptionsPlaceholder' })}
      />
    </div>
  ), [filterValue]);

  const getControlClass = useMemo(() => getClass({
    dirty,
    error,
    marginBottom0,
    useValidStyle,
    valid,
    warning,
  }), [
    error,
    warning,
    dirty,
    valid,
    useValidStyle,
    marginBottom0
  ]);

  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div>
      {label && (
        <Label
          {...getLabelProps()}
          readOnly={readOnly || readonly}
          required={required}
        >
          {label}
        </Label>
      )}
      <div className={css.selectionControlContainer}>
        <button
          type="button"
          {...getToggleButtonProps({
            ref: controlRef,
            tabIndex: undefined,
            disabled,
            readOnly,
          })}
          className={getControlClass}
          autoFocus={autofocus}
        >
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
        getMenuProps={getMenuProps}
        id={id}
        isOpen={isOpen}
        listMaxHeight={listMaxHeight}
        onChangeFilterValue={updateFilter}
        optionAlignment={optionAlignment}
        popper={popper}
        renderFilterInput={renderFilterInput}
        renderOptions={renderOptions}
        width={getControlWidth(controlRef.current)}
      />
    </div>
  );
};

Selection.propTypes = {
  asyncFilter: PropTypes.func,
  autofocus: PropTypes.bool,
  dataOptions: PropTypes.arrayOf(PropTypes.object),
  dirty: PropTypes.bool,
  disabled: PropTypes.bool,
  emptyMessage: PropTypes.node,
  error: PropTypes.node,
  formatter: PropTypes.func,
  id: PropTypes.string,
  inputRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  label: PropTypes.node,
  listMaxHeight: PropTypes.string,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.node,
  marginBottom0: PropTypes.bool,
  onChange: PropTypes.func,
  onFilter: PropTypes.func,
  optionAlignment: PropTypes.string,
  placeholder: PropTypes.node,
  popper: PropTypes.object,
  readOnly: PropTypes.bool,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  useValidStyle: PropTypes.bool,
  valid: PropTypes.bool,
  value: PropTypes.string,
  warning: PropTypes.bool,
}

export default Selection;
