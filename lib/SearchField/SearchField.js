/**
 * SearchField
 *
 * A universal search field component
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';

import TextField from '../TextField';
import TextArea from '../TextArea';
import Select from '../Select';
import TextFieldIcon from '../TextField/TextFieldIcon';

import css from './SearchField.css';

const INPUT_TYPES = {
  INPUT: 'input',
  TEXTAREA: 'textarea',
};

const INPUT_COMPONENTS = {
  [INPUT_TYPES.INPUT]: TextField,
  [INPUT_TYPES.TEXTAREA]: TextArea,
};

// Accepts the same props as TextField
const propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  clearSearchId: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  indexName: PropTypes.string,
  inputClass: PropTypes.string,
  inputRef: PropTypes.object,
  inputType: PropTypes.oneOf(Object.values(INPUT_TYPES)),
  loading: PropTypes.bool,
  lockWidth: PropTypes.bool,
  newLineOnShiftEnter: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeIndex: PropTypes.func,
  onClear: PropTypes.func,
  onSubmitSearch: PropTypes.func,
  placeholder: PropTypes.string,
  searchableIndexes: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
  })),
  searchableIndexesPlaceholder: PropTypes.string,
  searchableOptions: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  selectedIndex: PropTypes.string,
  value: PropTypes.string,
};

const SearchField = (props) => {
  const {
    className,
    placeholder,
    id,
    ariaLabel,
    indexName,
    value,
    onChange,
    onClear,
    loading,
    clearSearchId,
    searchableIndexes,
    searchableOptions,
    onChangeIndex,
    selectedIndex,
    searchableIndexesPlaceholder,
    inputClass,
    disabled,
    inputType,
    onSubmitSearch,
    lockWidth,
    newLineOnShiftEnter,
    ...rest
  } = props;

  /**
   * Search field has searchable indexes dropdown
   */
  let searchableIndexesDropdown;
  const hasSearchableIndexes = Array.isArray(searchableIndexes);
  const intl = useIntl();

  if (hasSearchableIndexes || searchableOptions) {
    const indexLabel = intl.formatMessage({ id: 'stripes-components.searchFieldIndex' });

    searchableIndexesDropdown = (
      <Select
        aria-label={indexLabel}
        dataOptions={searchableOptions ? undefined : searchableIndexes}
        disabled={loading}
        id={`${id}-qindex`}
        marginBottom0
        onChange={onChangeIndex}
        placeholder={searchableIndexesPlaceholder}
        selectClass={css.select}
        value={selectedIndex}
        name={indexName}
      >
        {searchableOptions}
      </Select>
    );
  }

  // Wrapper styles
  const rootStyles = classNames(
    css.searchFieldWrap,
    { [css.hasSearchableIndexes]: hasSearchableIndexes },
    className,
  );

  // Search icon
  const searchIcon = (<TextFieldIcon iconClassName={css.searchIcon} icon="search" />);

  // Placeholder
  let inputPlaceholder = placeholder;
  if (!placeholder && hasSearchableIndexes && selectedIndex) {
    const selectedIndexConfig = searchableIndexes.find(index => index.value === selectedIndex) || {};
    inputPlaceholder = selectedIndexConfig.placeholder || '';
  }

  const getInputComponentProps = () => {
    // TextField and TextArea have slightly different APIs so we need to pass props correctly
    const commonProps = {
      ...rest,
      'aria-label': rest['aria-label'] || ariaLabel,
      disabled,
      id,
      loading,
      onChange,
      startControl: !hasSearchableIndexes && !searchableOptions ? searchIcon : null,
      type: 'search',
      value: value || '',
      readOnly: loading || rest.readOnly,
      placeholder: inputPlaceholder,
    };

    const textFieldProps = {
      focusedClass: css.isFocused,
      inputClass: classNames(css.input, inputClass),
      hasClearIcon: typeof onClear === 'function' && loading !== true,
      onClearField: onClear,
      clearFieldId: clearSearchId,
    };
    const textAreaProps = {
      rootClass: rest.className,
      lockWidth,
      onSubmitSearch,
      newLineOnShiftEnter,
    };

    return {
      ...commonProps,
      ...(inputType === INPUT_TYPES.INPUT ? textFieldProps : {}),
      ...(inputType === INPUT_TYPES.TEXTAREA ? textAreaProps : {}),
    }
  };

  const Component = INPUT_COMPONENTS[inputType];

  return (
    <div className={rootStyles}>
      {searchableIndexesDropdown}
      <Component {...getInputComponentProps()} />
    </div>
  );
};

SearchField.propTypes = propTypes;
SearchField.defaultProps = {
  loading: false,
  lockWidth: false,
  newLineOnShiftEnter: false,
  searchableOptions: null,
  inputType: INPUT_TYPES.INPUT,
  onSubmitSearch: noop,
};

export default SearchField;
