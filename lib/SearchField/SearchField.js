/**
 * SearchField
 *
 * A universal search field component
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextField from '../TextField';
import Select from '../Select';
import TextFieldIcon from '../TextField/TextFieldIcon';
import css from './SearchField.css';

// Accepts the same props as TextField
const propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  clearSearchId: PropTypes.string,
  id: PropTypes.string,
  inputClass: PropTypes.string,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeIndex: PropTypes.func,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  searchableIndexes: PropTypes.arrayOf(
    PropTypes.object,
  ),
  searchableIndexesPlaceholder: PropTypes.string,
  selectedIndex: PropTypes.string,
  value: PropTypes.string,
};

const SearchField = (props) => {
  const {
    className,
    placeholder,
    id,
    ariaLabel,
    value,
    onChange,
    onClear,
    loading,
    clearSearchId,
    searchableIndexes,
    onChangeIndex,
    selectedIndex,
    searchableIndexesPlaceholder,
    inputClass,
    ...rest
  } = props;

  /**
   * Search field has searchable indexes dropdown
   */
  let searchableIndexesDropdown;
  const hasSearchableIndexes = Array.isArray(searchableIndexes);

  if (hasSearchableIndexes) {
    searchableIndexesDropdown = (
      <Select
        id={`${id}-qindex`}
        marginBottom0
        dataOptions={searchableIndexes}
        selectClass={css.select}
        placeholder={searchableIndexesPlaceholder}
        input={{
          onChange: onChangeIndex,
          value: selectedIndex,
        }}
      />
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
  const inputPlaceholder = (hasSearchableIndexes && selectedIndex) ? `Search for ${selectedIndex}` : placeholder;

  return (
    <div className={rootStyles}>
      {searchableIndexesDropdown}
      <TextField
        id={id}
        clearFieldId={clearSearchId}
        ariaLabel={ariaLabel}
        value={value || ''}
        onChange={onChange}
        startControl={!hasSearchableIndexes ? searchIcon : null}
        inputClass={classNames(css.input, inputClass)}
        focusedClass={css.isFocused}
        {...rest}
        placeholder={inputPlaceholder}
        onClearField={onClear}
        hasClearIcon={typeof onClear === 'function' && loading !== true}
        loading={loading}
      />
    </div>
  );
};

SearchField.propTypes = propTypes;

export default SearchField;
