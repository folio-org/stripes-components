import React, { useRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useCombobox } from 'downshift';
import classNames from 'classnames';
import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';
import Label from '../Label';
import Popper, { OVERLAY_MODIFIERS } from '../Popper';
import TextField from '../TextField';
import formField from '../FormField';
import parseMeta from '../FormField/parseMeta';
import useProvidedIdOrCreate from '../../hooks/useProvidedIdOrCreate';
import css from './AutoSuggest.css';

const getInputWidth = (container) => container?.offsetWidth;

const getClass = ({
  item,
  index,
  selectedItem,
  highlightedIndex
}) => classNames([
  `${css.autoSuggestItem}`,
  { [css.cursor]: highlightedIndex === index },
  { [css.selected]: isEqual(selectedItem, item) }
]);

const defaultIncludeItem = (item, searchString) => item.value.includes(searchString);
const defaultRender = item => (item ? item.value : '');

const getObjectFromValue = (value, valueKey, items) => {
  return items.filter((o) => o[valueKey] === value)[0];
}

const AutoSuggest = ({
  error,
  id,
  includeItem = defaultIncludeItem,
  items,
  label,
  name,
  onBlur,
  onChange = noop,
  onFocus = noop,
  onSelect = noop,
  placeholder,
  popper,
  renderOption = defaultRender,
  renderValue = defaultRender,
  required,
  usePortal,
  validationEnabled = true,
  value,
  valueKey = 'value',
}) => {
  const container = useRef(null);
  const textfield = useRef(null);
  const testId = useProvidedIdOrCreate(id, 'autoSuggest-');
  const [filterValue, setFilterValue] = useState(value);
  const getPortalElement = useRef(() => document.getElementById('OverlayContainer')).current;

  const filteredItems = useMemo(() => items
    .filter(item => !filterValue || includeItem(item, filterValue)),
  [filterValue, items]);

  const {
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    selectedItem,
    highlightedIndex,
    isOpen,
  } = useCombobox({
    id: testId,
    items: filteredItems,
    itemToString: renderValue,
    onInputValueChange: ({ inputValue: newValue }) => {
      onChange(newValue);
      setFilterValue(newValue);
    },
    selectedItem: getObjectFromValue(value, valueKey, items),
    onSelectedItemChange: ({ selectedItem }) => onSelect(selectedItem),
    inputValue: filterValue,
    initialInputValue: filterValue,
  });

  const popperProps = {
    portal: (isOpen && usePortal) ? getPortalElement() : undefined,
    modifiers: OVERLAY_MODIFIERS,
    ...popper
  };

  const control = (
    <div
      className={css.textFieldDiv}
      ref={container}
      aria-live="assertive"
      aria-relevant="additions"
    >
      { label && (
        <Label
          {...getLabelProps({
            htmlFor: testId
          })}
        >
            {label}
        </Label>
      )}
      <TextField
        {...getInputProps(
          {
            ref: textfield,
            onBlur,
            onFocus,
            refKey: 'inputRef'
          }
        )}
        autoComplete="off"
        required={required}
        name={name}
        placeholder={placeholder}
        validationEnabled={validationEnabled}
        error={error}
        data-test-autosuggest-input
        id={testId}
      />
    </div>
  );

  const list = (
    <ul
      className={css.autoSuggest}
      {...getMenuProps({
        style: {
          width: `${getInputWidth(container?.current)}px`,
          visibility: isOpen ? 'visible' : 'hidden'
        }
      }, { suppressRefError: true })}
    >
      {isOpen
        ? filteredItems.map((item, index) => (
          <li
            {...getItemProps({
              index,
              item,
            })}
            key={`${index}_${item[valueKey]}`}
            className={getClass({ item, index, selectedItem, highlightedIndex })}
          >
            {renderOption(item)}
          </li>
        ))
        : null}
    </ul>
  );

  return (
    <div className={css.downshift} data-test-autosuggest aria-expanded={isOpen}>
      {control}
      <Popper hideIfClosed isOpen={isOpen} anchorRef={container} {...popperProps}>
        {list}
      </Popper>
    </div>
  );
}

AutoSuggest.propTypes = {
  error: PropTypes.node,
  id: PropTypes.string,
  includeItem: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.node,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  placeholder: PropTypes.node,
  popper: PropTypes.shape({}),
  renderOption: PropTypes.func,
  renderValue: PropTypes.func,
  required: PropTypes.bool,
  usePortal: PropTypes.bool,
  validationEnabled: PropTypes.bool,
  value: PropTypes.string,
  valueKey: PropTypes.string,
};

export default formField(
  AutoSuggest,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    valid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);
