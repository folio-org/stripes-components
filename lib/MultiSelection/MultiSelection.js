import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  isEqual,
  noop,
  debounce,
} from 'lodash';
import { useIntl } from 'react-intl';
import { useMultipleSelection, useCombobox } from 'downshift';
import { OVERLAY_MODIFIERS } from '../Popper';
import SelectedValuesList from './SelectedValuesList';
import MultiSelectFilterField from './MultiSelectFilterField';
import MultiSelectResponsiveRenderer from './MultiSelectResponsiveRenderer';
import SelectOption from './SelectOption';
import MultiSelectOptionsList from './MultiSelectOptionsList';
import ValueChip from './ValueChip';
import DefaultOptionFormatter from '../Selection/DefaultOptionFormatter';

import SRStatus from '../SRStatus';
import TextFieldIcon from '../TextField/TextFieldIcon';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import formField from '../FormField';
import Label from '../Label';
import { Loading } from '../Loading';
import parseMeta from '../FormField/parseMeta';
import useProvidedIdOrCreate from '../../hooks/useProvidedIdOrCreate';

import css from './MultiSelect.css';
import formStyles from '../sharedStyles/form.css';
import useProvidedRefOrCreate from '../../hooks/useProvidedRefOrCreate';

const filterOptions = (filterText, list) => {
  // escape special characters in filter text, so they won't be interpreted by RegExp
  const escapedFilterText = filterText?.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');

  const filterRegExp = new RegExp(`^${escapedFilterText}`, 'i');
  const renderedItems = filterText ? list.filter(item => item.label.search(filterRegExp) !== -1) : list;
  const exactMatch = filterText ? (renderedItems.filter(item => item.label === filterText).length === 1) : false;
  return { renderedItems, exactMatch };
};

const dbResize = debounce(
  (cb) => cb(window.matchMedia('(max-width: 640px)').matches), { leading: false, trailing: true }
);

const getContainerWidth = (container) => { // eslint-disable-line consistent-return
  return container.current?.offsetWidth || 100;
};

// handleSelection - addition/removal of selected options, also ensures selected
// options are deduped.
const handleSelection = (selectedItem, selectedItems, removeSelectedItem, addSelectedItem, onAdd) => {
  const selectedIndex = selectedItems.findIndex((item) => isEqual(item, selectedItem));
  if (selectedIndex !== -1) {
    removeSelectedItem(selectedItem);
  } else {
    addSelectedItem(selectedItem);
    onAdd(selectedItem);
  }
};

const handleRemoval = (selectedItems, newSelectedItems, onRemove) => {
  if (selectedItems.length !== 0) {
    const removed = selectedItems.filter(old => newSelectedItems.findIndex(newItem => isEqual(old, newItem)) < 0)
    if (removed.length > 0) {
      onRemove(removed[0]);
    }
  }
};

const MultiSelection = ({
  actions = [],
  asyncFiltering = false,
  autoFocus = false,
  backspaceDeletes = true,
  dataOptions = [],
  dirty,
  disabled,
  emptyMessage: emptyMessageProp,
  error,
  filter = filterOptions,
  formatter = DefaultOptionFormatter,
  id,
  inputRef,
  isValid,
  itemToString = option => (option ? option.label : ''),
  label: labelProp,
  maxHeight = 168,
  marginBottom0,
  modifiers = OVERLAY_MODIFIERS,
  noBorder,
  onAdd = noop,
  onBlur = noop,
  onChange = noop,
  onFocus = noop,
  onRemove = noop,
  placeholder,
  required = false,
  showLoading,
  usePortal,
  validationEnabled,
  validStylesEnabled = false,
  value,
  valueFormatter,
  warning,
  ...rest
}) => {
  const { formatMessage } = useIntl();
  const [atSmallMedia, setAtSmallMedia] = useState(window.matchMedia('(max-width: 640px)').matches);
  const [filterFocused, setFilterFocused] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const awaitingChange = useRef(false);
  const userSelection = useRef(null);
  const container = useRef(null);
  const control = useRef(null);
  const input = useProvidedRefOrCreate(inputRef);
  const selectedList = useRef(null);
  const srStat = useRef(null);
  const uiId = useProvidedIdOrCreate(id, 'multiselect-');

  const ariaLabelledBy = useRef(rest['aria-labelledby'] || rest.ariaLabelledby || rest.ariaLabelledBy).current;
  const valueLabelId = useRef(`multi-value-${uiId}`).current;
  const valueListId = useRef(`multi-values-list-${uiId}`).current;
  const valueDescriptionId = useRef(`multi-describe-action-${uiId}`).current;
  const controlDescriptionId = useRef(`multi-describe-control-${uiId}`).current;
  const controlValueStatusId = useRef(`multi-value-status-${uiId}`).current;
  const ariaLabel = useRef(rest.ariaLabel || rest['aria-label']).current;
  const labelId = useRef(`${uiId}-label`).current;
  const label = useRef(labelProp || ariaLabel || rest['aria-label']).current;
  const actionId = useRef(`multiselect-action-${uiId}`).current;
  const menuId = useRef(`multiselect-option-list-${uiId}`).current;
  const valueInputId = useRef(`multiselect-input-${uiId}`).current;
  const filterId = useRef(`${uiId}-input`).current;
  const dbFilter = useRef(debounce(filter, 300, { leading: false, trailing: true })).current;

  const emptyMessage = useRef(
    emptyMessageProp ||
    formatMessage({ id: 'stripes-components.multiSelection.defaultEmptyMessage' })
  ).current;

  const options = useMemo(
    () => (asyncFiltering ? { renderedItems: dataOptions || [], exactMatch: false } : filter(filterValue, dataOptions)),
    [asyncFiltering, filterValue, dataOptions, filter]
  );

  // This component makes use of useMultiSelection and useCombobox hooks from downshift.
  // useMultiSelection manages the list of selected items. It provides methods to add/remove affect that state.
  // useCombobox manages the other state of other interactions with the component -
  //    cursor position,
  //    open/closed state of the menu
  //    keyboard handlers/prop getters.
  const {
    getDropdownProps, // apply attributes to input or button trigger for dropdown
    removeSelectedItem, // handler for removing the item from selected items
    addSelectedItem, // handler for adding the item from selected items
    selectedItems, // downshift manages this state.
    setSelectedItems, // used only when the value changes from the outside of the component.
  } = useMultipleSelection({
    initialSelectedItems: value || [],
    itemToKey: itemToString,  /* used by downshift's internal equality checker. We override it because it would default
                                  a strict equals on objects which probably won't succeed. itemToString will
                                  boil each object down to a string, so that the strict-equals will
                                  have a better time succeeding.  */
    onSelectedItemsChange(changes) {
      // only trigger onChange if selectedItems is different from from the incoming value prop.
      // this avoids instances when the value can appear *not to change for the user but it's really the cause of
      // values just changing between re-renders and react just catching whichever onChange was triggered last.
      if (typeof value === 'undefined') {
        // since 'undefined' isn't [], it will never pass the equality check, so to account
        // for a change to 'undefined', we need a special case.
        if (changes.selectedItems.length !== 0) {
          onChange(changes.selectedItems);
        }
      } else if (!isEqual(value, changes.selectedItems)) {
        onChange(changes.selectedItems);
      }
    },
    // since we want the component to discern between internal changes
    // and external changes in the selected item,
    // we catch the internal changes with this function and flag the 'awaitingChange' ref to let
    // state-syncing logic know the change happened internally, so we don't expect the value prop to sync until
    // our `onChange` has been called...
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;
      switch (type) {
        // backspace removal of slected items is handled here...
        case useMultipleSelection.stateChangeTypes
          .SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes
          .DropdownKeyDownBackspace:
          if (backspaceDeletes) {
            handleRemoval(selectedItems, changes.selectedItems, onRemove);
            awaitingChange.current = true;
            userSelection.current = changes.selectedItems;
          }
          return changes;
        case useMultipleSelection.stateChangeTypes
          .SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes
          .FunctionRemoveSelectedItem:
          // this calls the onRemove handle for the variety of different ways that a selected option can be removed.
          handleRemoval(selectedItems, changes.selectedItems, onRemove);
          awaitingChange.current = true;
          userSelection.current = changes.selectedItems;
          return changes;
        case useMultipleSelection.stateChangeTypes.FunctionAddSelectedItem:
          userSelection.current = changes.selectedItems;
          awaitingChange.current = true;
          return changes;
        default:
          return changes;
      }
    }
  });

  const {
    getLabelProps, // props for the label
    getInputProps, // props for the filter input
    getMenuProps, // props for the overlay element
    getItemProps, // props for option items
    getToggleButtonProps, // for the elements that can toggle the dropdown (the filter input, the dropdown button.)
    openMenu,
    isOpen, // whether dropdown is open or closed. More state managed by Downshift.
    highlightedIndex, // cursor value
    reset,
  } = useCombobox({
    defaultHighlightedIndex: 0,
    selectedItem: null,
    itemToString,
    inputValue: null,
    items: [...options.renderedItems, ...actions],
    onStateChange({
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (newSelectedItem) {
            // custom handler used to de-dupe selected objects. Will call the add/remove functions
            // for manipulating the downshift state from useMultipleSelection.
            handleSelection(
              newSelectedItem,
              selectedItems,
              removeSelectedItem,
              addSelectedItem,
              onAdd
            );
            setFilterValue('');
          }
          break;
        default:
          break;
      }
    },
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges
      switch (type) {
        case useCombobox.stateChangeTypes.InputEvent:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (changes?.selectedItem?.onSelect) {
            changes.selectedItem.onSelect({
              ...state,
              ...options,
              filterText: filterValue,
              inputValue: filterValue,
              selectedItems,
              reset
            });
            setFilterValue('');
            return {
              isOpen: false, // close the menu.
              highlightedIndex, // don't move highlight cursor back to top of list on selection.
            }
          } else {
            awaitingChange.current = true;
          }
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
            highlightedIndex, // don't move highlight cursor back to top of list on selection.
          }
        default:
          return changes
      }
    },
  });

  // set up resize handler onMount...
  useEffect(() => {
    const resizeHandler = () => { dbResize(setAtSmallMedia) };
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  // retain focus on filter input if we happen to switch between
  // small and large screen components.
  useEffect(() => {
    if (filterFocused) input.current?.focus();
  }, [atSmallMedia, filterFocused, input]);

  // for async filtering, call filter function as a debounced after-effect of filter value changing...
  useEffect(() => {
    if (asyncFiltering) {
      dbFilter(filterValue, dataOptions);
    }
  }, [filterValue, asyncFiltering, dataOptions, dbFilter]);

  const handleControlClick = useCallback(() => {
    if (disabled) {
      return;
    }

    if (!isOpen) {
      input.current?.focus();
      openMenu();
    }
  }, [disabled, isOpen, input, openMenu]);

  const getRemoveButtonProps = useCallback(({
    onClick = () => {},
    item,
    ...props
  } = {}) => {
    return {
      onClick: e => {
        onClick(e);
        e.stopPropagation();
        removeSelectedItem(item);
      },
      onKeyDown: e => {
        switch (e.key.toLowerCase()) {
          case 'end':
            selectedList.current.querySelector('li:last-child button').focus();
            break;
          case 'home':
            selectedList.current.querySelector('li:first-child button').focus();
            break;
          case 'left':
          case 'right':
          default:
        }
      },
      ...props
    };
  }, [removeSelectedItem]);

  const controlClass = useMemo(() => {
    return classnames(
      css.multiSelectControl,
      {
        [`${css.multiSelectFocused}`]: filterFocused,
        [`${formStyles.isDisabled}`]: disabled,
      },
      sharedInputStylesHelper({
        dirty,
        error,
        marginBottom0,
        noBorder,
        valid: isValid,
        validationEnabled,
        validStylesEnabled,
        warning
      }),
    );
  }, [
    filterFocused,
    disabled,
    dirty,
    error,
    marginBottom0,
    noBorder,
    isValid,
    validationEnabled,
    validStylesEnabled,
    warning
  ]);

  /**
   * Moves focus to the filter input on desktop and the control element on mobile
   * when the hidden value input is focused.
   * This will typically happen when the required prop is set to true
   * and the HTML5 validation kicks in on form submit.
   */
  const onValueInputFocus = useCallback(() => {
    if (atSmallMedia) {
      control.current?.focus();
    } else {
      input.current?.focus();
    }
    srStat.current.sendMessage(formatMessage({ id: 'stripes-components.requiredFieldMessage' }));
  }, [atSmallMedia, formatMessage, input]);

  const renderSelectedItems = useCallback(() => selectedItems.map((item, index) => {
    const selectedFormatter = valueFormatter || formatter;
    return (
      <ValueChip
        key={`${itemToString(item)}-${index}`}
        id={`${itemToString(item)}-${index}`}
        controlLabelId={valueLabelId}
        descriptionId={valueDescriptionId}
        disabled={disabled}
        getRemoveButtonProps={getRemoveButtonProps}
        item={item}
        index={index}
      >
        {selectedFormatter({ option: item })}
      </ValueChip>
    );
  }), [
    disabled,
    formatter,
    getRemoveButtonProps,
    itemToString,
    selectedItems,
    valueDescriptionId,
    valueFormatter,
    valueLabelId
  ]);

  /*  Filter input ends up rendered in one of two places.
      On smaller screens The filter input is placed in the overlay at the top
      of the list of possible value options. On large screens, the placeholder is
      presented with the list of.
  */
  const renderFilterInput = useCallback(() => (
    <MultiSelectFilterField
      ariaLabelledBy={ariaLabelledBy || labelId}
      disabled={disabled}
      filterValue={filterValue}
      getInputProps={getInputProps}
      getDropdownProps={getDropdownProps}
      isOpen={isOpen}
      placeholder={selectedItems.length === 0 ? placeholder : ''}
      menuId={menuId}
      setFilterValue={setFilterValue}
      setFilterFocus={setFilterFocused}
      inputRef={input}
      onBlur={onBlur}
      onFocus={onFocus}
      id={filterId}
    />
  ), [
    labelId,
    ariaLabelledBy,
    disabled,
    filterId,
    filterValue,
    getDropdownProps,
    getInputProps,
    isOpen,
    onBlur,
    menuId,
    onFocus,
    placeholder,
    selectedItems.length,
    input
  ]);

  const renderOptions = useCallback(() => options.renderedItems?.map((item, index) => (
    <SelectOption
      key={`${itemToString(item)}`}
      {...getItemProps({
        item,
        index,
        optionItem: item,
        isActive: highlightedIndex === index,
        isDisabled: disabled,
        isSelected: selectedItems ?
          selectedItems.findIndex((o) => isEqual(o, item)) !== -1 :
          false
      })}
    >
      {formatter({ option: item, searchTerm: filterValue })}
    </SelectOption>
  )), [
    filterValue,
    formatter,
    disabled,
    getItemProps,
    highlightedIndex,
    itemToString,
    options.renderedItems,
    selectedItems
  ]);

  const getValueAsString = useCallback(() => {
    return Array.isArray(selectedItems) ? selectedItems.map(itemToString).join(',') : '';
  }, [selectedItems, itemToString]);

  const renderActions = useCallback(() => actions?.map((item, index) => {
    const { renderedItems, exactMatch } = options;
    const actionIndex = renderedItems.length + index;
    return (
      <SelectOption
        key={`${actionId}-action-${actionIndex}`}
        {...getItemProps({
          item: { ...item, downshiftActions: { reset } },
          index: actionIndex,
          optionItem: item,
          isActive: highlightedIndex === actionIndex,
        })}
      >
        {
        item.render({
          filterValue,
          exactMatch,
          renderedItems,
        })
      }
      </SelectOption>
    );
  }), [actionId, actions, filterValue, getItemProps, highlightedIndex, options, reset]);

  // check if value prop has changed from the outside and update state accordingly.
  if (awaitingChange.current) {
    if (
      // re-renders can happen inbetween user interaction, the request to update state, and the
      // expected state finally being committed.
      // Check if the incoming value prop is in sync with our anticipated state update so that we know
      // our change has landed and we can go back to paying attention to external value prop updates.
      (value && isEqual(value, userSelection.current)) ||
      (typeof value === 'undefined' && selectedItems.length === 0)
    ) {
      awaitingChange.current = false;
      userSelection.current = null;
    }
  } else if (!awaitingChange.current &&
    ((typeof value === 'undefined' && selectedItems.length !== 0) ||
      (value && !isEqual(value, selectedItems)))) {
    setSelectedItems(value || []);
  }

  return (
    <div
      className={css.multiSelectContainer}
      role="application"
      ref={container}
      id={uiId}
      aria-expanded={isOpen}
    >
      <SRStatus ref={srStat} />
      {label &&
        <Label
          {...getLabelProps({
            required,
            id: labelId,
            htmlFor: filterId,
          })}
          className={`${ariaLabel ? 'sr-only' : ''}`}
        >
          {label}
        </Label>
      }
      <span className="sr-only" id={controlValueStatusId}>
        {`${
          selectedItems ? selectedItems.length : 0
        } item${
          !selectedItems || selectedItems.length !== 1 ? 's' : ''
        } selected`
        }
      </span>
      <span className="sr-only" id={controlDescriptionId}>
        { formatMessage({ id: 'stripes-components.multiSelection.controlDescription' })}
      </span>
      {/*
        Multiselection handles accessible announcement by following the label - value announcement pattern
        that's common to standard controls, inputs etc. The announcement includes the label as well as
        the number of selected items (if any).
        This is assembled via a collection of elements used with the aria-labelledby attribute. Other labeling
        attributes suche as `aria-label` are rendered into these elements and applied through the
        aria-labelledby attribute.
      */}
      <div className={css.multiSelectControlWrapper}>
        <div
          className={controlClass}
          tabIndex="0"
          ref={control}
          aria-labelledby={`${labelProp ?
            labelId + ' ' :
            ''}${
            (!labelProp && ariaLabelledBy) ?
              ariaLabelledBy + ' ' :
              ''}${controlValueStatusId}`}
          aria-describedby={controlDescriptionId}
          onClick={handleControlClick}
          role="searchbox"
          onKeyDown={getDropdownProps().onKeyDown}
        >
          <div className={css.multiSelectControlGroup}>
            { selectedItems && selectedItems.length > 0 && (
              <SelectedValuesList
                id={valueListId}
                listRef={selectedList}
                renderSelectedItem={renderSelectedItems}
                valueLabelId={valueLabelId}
                valueDescriptionId={valueDescriptionId}
                renderSelectedItems={renderSelectedItems}
              />
            )}
            {!atSmallMedia ?
              renderFilterInput() :
              <div>placeholder</div>
            }
            {/* MultiSelectValueInput is visually hidden via CSS and contains string versions of selected items.
                This allows for this component to be validated using HTML5
                validation for the 'required' attribute.
            */}
            <input
              className={css.multiSelectValueInput}
              id={valueInputId}
              required={required}
              value={getValueAsString(value)}
              onChange={noop}
              autoFocus={autoFocus}
              onFocus={onValueInputFocus}
              aria-hidden
              tabIndex="-1"
            />
          </div>
          {showLoading && (
            <Loading />
          )}
          <button
            className={css.multiSelectToggleButton}
            type="button"
            {...getToggleButtonProps({
              ...getDropdownProps({
                'aria-label': formatMessage({ id: 'stripes-components.multiSelection.dropdownTriggerLabel' }),
                'aria-controls': menuId,
                // prevents the menu from immediately toggling
                // closed (due to our custom click handler above).
                onClick: (e) => e.stopPropagation(),
                disabled
              })
            })}
          >
            <TextFieldIcon icon="triangle-down" />
          </button>
        </div>
        <MultiSelectResponsiveRenderer atSmallMedia={atSmallMedia} isOpen={isOpen}>
          <MultiSelectOptionsList
            renderActions={renderActions}
            renderFilterInput={renderFilterInput}
            asyncFiltering={asyncFiltering}
            renderOptions={renderOptions}
            renderedItems={options?.renderedItems}
            actions={actions}
            containerWidth={getContainerWidth(container)}
            controlRef={control}
            id={menuId}
            labelId={labelId}
            isOpen={isOpen}
            getMenuProps={getMenuProps}
            maxHeight={maxHeight}
            emptyMessage={emptyMessage}
            error={error}
            warning={warning}
            atSmallMedia={atSmallMedia}
            modifiers={modifiers}
            usePortal={usePortal}
          />
        </MultiSelectResponsiveRenderer>
      </div>
      <div role="alert">
        {error && <div className={css.multiSelectError}>{error}</div>}
        {warning && <div className={css.multiSelectWarning}>{warning}</div>}
      </div>
    </div>
  );
}


const propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object),
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  asyncFiltering: PropTypes.bool,
  autoFocus: PropTypes.bool,
  backspaceDeletes: PropTypes.bool,
  dataOptions: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ])
  ),
  dirty: PropTypes.bool,
  disabled: PropTypes.bool,
  emptyMessage: PropTypes.string,
  error: PropTypes.node,
  filter: PropTypes.func,
  formatter: PropTypes.func,
  id: PropTypes.string,
  inputRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }),
  isValid: PropTypes.bool,
  itemToString: PropTypes.func,
  label: PropTypes.node,
  marginBottom0: PropTypes.bool,
  maxHeight: PropTypes.number,
  modifiers: PropTypes.object,
  noBorder: PropTypes.bool,
  onAdd: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onRemove: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLoading: PropTypes.bool,
  usePortal: PropTypes.bool,
  validationEnabled: PropTypes.bool,
  validStylesEnabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string]),
  valueFormatter: PropTypes.func,
  warning: PropTypes.node,
};
MultiSelection.propTypes = propTypes;

export default formField(
  MultiSelection,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    isValid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);
