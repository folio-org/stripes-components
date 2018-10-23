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
        dataOptions={searchableIndexes}
        id={`${id}-qindex`}
        marginBottom0
        onChange={onChangeIndex}
        placeholder={searchableIndexesPlaceholder}
        selectClass={css.select}
        value={selectedIndex}
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
        {...rest}
        ariaLabel={ariaLabel}
        clearFieldId={clearSearchId}
        focusedClass={css.isFocused}
        id={id}
        hasClearIcon={typeof onClear === 'function' && loading !== true}
        inputClass={classNames(css.input, inputClass)}
        loading={loading}
        onChange={onChange}
        onClearField={onClear}
        placeholder={inputPlaceholder}
        startControl={!hasSearchableIndexes ? searchIcon : null}
        type="search"
        value={value || ''}
      />
    </div>
  );
};

SearchField.propTypes = propTypes;

export default SearchField;
