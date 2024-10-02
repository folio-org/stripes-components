import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { deprecated } from 'prop-types-extra';
import { useIntl } from 'react-intl';
import { useCombobox } from 'downshift';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import formField from '../FormField';
import parseMeta from '../FormField/parseMeta';

import {
  defaultItemToString,
  reduceOptions,
  filterOptionList,
  getSelectedObject,
  flattenOptionList,
  reconcileReducedIndex,
} from './utils';
import SelectionOverlay from './SelectionOverlay';

import Label from '../Label';
import TextFieldIcon from '../TextField/TextFieldIcon';
import Icon from '../Icon';
import useProvidedRefOrCreate from '../../hooks/useProvidedRefOrCreate'
import formStyles from '../sharedStyles/form.css';
import css from './Selection.css';
import DefaultOptionFormatter from './DefaultOptionFormatter';
import useProvidedIdOrCreate from '../../hooks/useProvidedIdOrCreate';

// a rough way to discern if an option is grouped or not - if it finds an index at the top level
// of dataOptions, it's not grouped...
const optionIsGrouped = (item, dataOptions) => {
  return dataOptions.findIndex((i) => i === item) === -1;
};

const getControlWidth = (control) => {
  if (control) {
    return control.offsetWidth;
  }
  return undefined;
}

const getItemClass = (item, i, props) => {
  const { value } = item;
  const { selectedItem, highlightedIndex, dataOptions } = props;
  if (!value) {
    return;
  }

  const cursored = i === highlightedIndex ? ' ' + css.cursor : '';
  const selected = value === selectedItem?.value ? ' ' + css.selected : '';
  const grouped = optionIsGrouped(item, dataOptions) ? ' ' + css.groupedOption : '';

  // eslint-disable-next-line consistent-return
  return `${css.option}${cursored}${selected}${grouped}`;
}

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

/* eslint-disable prefer-arrow-callback */

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
  onBlur,
  onChange,
  onFocus,
  placeholder,
  label,
  listMaxHeight = '174px',
  loading,
  loadingMessage = <Icon icon="spinner-ellipsis" />,
  marginBottom0,
  name,
  onFilter = filterOptionList,
  optionAlignment,
  popper,
  readOnly,
  readonly,
  required,
  useValidStyle = false,
  usePortal,
  valid,
  value,
  warning,
  ...rest
}) => {
  const { formatMessage } = useIntl();
  const [filterValue, updateFilterValue] = useState('');
  const [debouncedFilterValue, updateDebouncedFilter] = useState('');
  const dataLength = useRef(dataOptions?.length || 0);
  const controlRef = useProvidedRefOrCreate(inputRef);
  const awaitingChange = useRef(false);
  const dbUpdateFilter = useRef(debounce((filter) => {
    updateDebouncedFilter(filter)
  }, 200)).current;
  const filterUpdateFn = useRef(function filterUpdater(filter) {
    updateFilterValue(filter);
    // debounce updates to the filter for large data sets...
    dbUpdateFilter(filter);
  }).current;

  const filterFn = useCallback(function filter(data) {
    return onFilter(debouncedFilterValue, data);
  }, [debouncedFilterValue, onFilter]);

  const flattenRef = useRef(function flattener(data) {
    return flattenOptionList(data);
  }).current;

  const reduceOptionsRef = useRef(function dataReducer(data) {
    return reduceOptions(data);
  }).current;

  const options = useMemo(() => {
    return (asyncFilter || !debouncedFilterValue) ? dataOptions : filterFn(dataOptions)
  },
  [dataOptions, debouncedFilterValue]);

  const testId = useProvidedIdOrCreate(id, 'selection-');
  const hasGroups = dataOptions.some((item) => item.options);

  // we need to skip over group headings since those can neither be selectable or cursored over.
  const reducedListItems = useMemo(
    () => { return hasGroups ? reduceOptionsRef(options) : options },
    [options.length, hasGroups]
  )

  const {
    isOpen,
    getToggleButtonProps,
    getInputProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    selectItem: updateSelectedItem,
  } = useCombobox({
    items: reducedListItems || [],
    itemToString: defaultItemToString,
    initialSelectedItem: value ? getSelectedObject(value, dataOptions) : null,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      // if the newSelectedItem's value matches the incoming value prop, we assume that
      // onChange isn't necessary.
      if (onChange && newSelectedItem?.value !== value) {
        onChange(newSelectedItem.value);
      }
      updateDebouncedFilter(''); // so that we can unfilter the options for the next time the list opens.
    },
    isItemDisabled(item) {
      return ((readOnly || readonly) && !isEqual(item, selectedItem));
    },
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          awaitingChange.current = true;
          return changes;
        default:
          return changes;
      }
    }
  });

  useEffect(() => {
    // if dataOptions populate/change after the initial render, update the selectedItem state
    // if one hasn't been found yet.
    if (dataOptions?.length !== dataLength.current && value && selectedItem === null) {
      const selected = getSelectedObject(value, dataOptions);
      updateSelectedItem(selected);
      dataLength.current = dataOptions.length;
    }
  }, [dataOptions, selectedItem, value])

  const valueLabel = formatter({ option: selectedItem }) || placeholder || '';
  const labelId = `sl-label-${testId}`;
  const valueId = `selected-${testId}-item`;

  if (awaitingChange.current) {
    // a user has change the value via the dropdown and we're waiting for the value
    // to correspond with the state...
    if (selectedItem !== null && selectedItem?.value === value) {
      awaitingChange.current = false;
    }
  } else if ((
    selectedItem !== null ||
    // if we can find a valid dataOption to match the value (for dataOptions that have value: '')
    getSelectedObject(value, dataOptions) !== null
  ) && selectedItem?.value !== value) {
    // conform to post-mount value prop changes from outside of the component,
    // whether the changed value is something empty like '' or null;
    const newValue = getSelectedObject(value, dataOptions) || { value }
    updateSelectedItem(newValue);
  }

  /** renderOptions
   *  All of the rendering of the options list is performed here.
   *  This memoized function is passed into the SelectionOverlay & SelectionList
   */

  // if the options are grouped, flatten them for rendering.
  const flattenedOptions = useMemo(
    () => {
      return hasGroups && options.length > 0 ? flattenRef(options) : options;
    },
    [options, hasGroups]
  )

  const renderedOptionsFn = useCallback(function optionRenderer(data) {
    const rendered = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (item.value) {
        const reducedIndex = reconcileReducedIndex(item, reducedListItems);
        rendered.push(
          <li
            key={`${item.label}-option-${i}`}
            {...getItemProps({
              index: reducedIndex,
              onMouseUp: e => e.stopPropagation(),
            })}
            className={getItemClass(item, reducedIndex, { selectedItem, highlightedIndex, dataOptions })}
          >
            {formatter({ option: item, searchTerm: filterValue })}
          </li>
        )
      } else {
        rendered.push(
          <li
            key={`${item.label}-heading-${i}`}
            className={css.groupLabel}
          >
            {formatter({ option: item, searchTerm: filterValue })}
          </li>
        );
      }
    }
    return rendered;
  }, [filterValue, flattenedOptions]);

  const optionsProcessing = false;
  const renderedOptions = useMemo(
    () => renderedOptionsFn(flattenedOptions),
    [flattenedOptions.length, debouncedFilterValue]
  );

  // It doesn't need to update if *all of the things it uses change...
  /* eslint-disable react-hooks/exhaustive-deps */
  const renderOptions = useCallback(() => {
    if (!isOpen) return null;
    // if options are delivered with groupings, we flatten the options for
    // a set of selectable indices. Group labels are not selectable.
    /* loading message */
    if (loading || (filterValue !== debouncedFilterValue)) {
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
          <span>-{emptyMessage}-</span>
        </li>
      );
    }

    /* no options found through filtering */
    if (options.length === 0) {
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
    return renderedOptions;
  }, [
    loading,
    selectedItem,
    highlightedIndex,
    value,
    options,
    isOpen,
    optionsProcessing,
    renderedOptions,
  ]);

  const renderFilterInput = useCallback((filterRef) => (
    <div className={css.selectionFilterContainer}>
      <input
        type="text"
        {...getInputProps({
          ref: filterRef,
          value: filterValue,
          // stopPropagation to keep from unwantedly triggering shortcuts and
          // address downshift issues with portal rendering/functionality.
          // https://github.com/downshift-js/downshift/issues/287
          onKeyDown: (e) => e.stopPropagation(),
          onMouseUp: (e) => e.stopPropagation(),
        })}
        onClick={() => {}}
        onChange={(e) => filterUpdateFn(e.target.value)}
        aria-label={formatMessage({ id: 'stripes-components.selection.filterOptionsLabel' }, { label })}
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
          {...getLabelProps({
            id: labelId,
          })}
          readOnly={readOnly || readonly}
          required={required}
        >
          {label}
        </Label>
      )}
      <div className={css.selectionControlContainer}>
        <div className={formStyles.inputGroup}>
          <button
            type="button"
            {...getToggleButtonProps({
              ref: controlRef,
              tabIndex: undefined,
              disabled,
              readOnly,
              id: testId,
              'aria-labelledby': `${labelId} ${valueId}`
            })}
            className={getControlClass}
            autoFocus={autofocus}
            onBlur={onBlur}
            onFocus={onFocus}
            name={name}
            value={selectedItem?.value}
          >
            <span className="sr-only">{formatMessage({ id: 'stripes-components.selection.controlLabel' })}</span>
            <div className={css.singleValue} id={valueId}>{valueLabel}</div>
          </button>
          <div className={css.selectionEndControls}>
            <TextFieldIcon icon="triangle-down" />
          </div>
        </div>
        <div role="alert">
          {warning && <div className={`${formStyles.feedbackWarning}`}>{warning}</div>}
          {error && <div className={`${formStyles.feedbackError}`}>{error}</div>}
        </div>
      </div>
      <SelectionOverlay
        {...rest}
        controlRef={controlRef}
        getMenuProps={getMenuProps}
        id={testId}
        isOpen={isOpen}
        listMaxHeight={listMaxHeight}
        onChangeFilterValue={updateFilterValue}
        optionAlignment={optionAlignment}
        popper={popper}
        renderFilterInput={renderFilterInput}
        renderOptions={renderOptions}
        usePortal={usePortal}
        width={getControlWidth(controlRef.current)}
        labelId={labelId}
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
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFilter: PropTypes.func,
  onFocus: PropTypes.func,
  optionAlignment: PropTypes.string,
  placeholder: PropTypes.node,
  popper: PropTypes.shape({
    portal: deprecated(PropTypes.element, 'use the boolean usePortal prop of Selection instead')
  }),
  readOnly: PropTypes.bool,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  usePortal: PropTypes.bool,
  useValidStyle: PropTypes.bool,
  valid: PropTypes.bool,
  value: PropTypes.string,
  warning: PropTypes.node,
}

export default formField(
  Selection,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    valid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);

/* eslint-enable */
