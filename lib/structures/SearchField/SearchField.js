/**
 * SearchField
 *
 * A universal search field component
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextField from '../../TextField';
import Select from '../../Select';
import TextFieldIcon from '../../TextField/TextFieldIcon';
import css from './SearchField.css';

// Accepts the same props as TextField
const propTypes = {
  placeholder: PropTypes.string,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  clearSearchId: PropTypes.string,
  onClear: PropTypes.func,
  selectedIndex: PropTypes.string,
  searchableIndexesPlaceholder: PropTypes.string,
  onChangeIndex: PropTypes.func,
  searchableIndexes: PropTypes.arrayOf(
    PropTypes.object,
  ),
};

const defaultProps = {
  placeholder: 'Search..',
};

const SearchField = (props) => {
  const {
    placeholder,
    id,
    ariaLabel,
    value,
    onChange,
    onClear,
    clearSearchId,
    searchableIndexes,
    onChangeIndex,
    selectedIndex,
    searchableIndexesPlaceholder,
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
        marginBottom0
        dataOptions={searchableIndexes}
        selectClass={css.select}
        placeholder={!searchableIndexesPlaceholder ? 'Search all fields' : searchableIndexesPlaceholder}
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
  );

  // Search icon
  const searchIcon = (<TextFieldIcon icon="search" />);

  // Placeholder
  const inputPlaceholder = (hasSearchableIndexes && selectedIndex) ? `Search for ${selectedIndex}` : placeholder;

  return (
    <div className={rootStyles}>
      {searchableIndexesDropdown}
      <TextField
        id={id}
        clearFieldId={clearSearchId}
        ariaLabel={ariaLabel}
        input={{ value }}
        onChange={onChange}
        startControl={!hasSearchableIndexes ? searchIcon : null}
        inputClass={css.input}
        {...rest}
        placeholder={inputPlaceholder}
        onClearField={onClear}
      />
    </div>
  );
};

SearchField.propTypes = propTypes;
SearchField.defaultProps = defaultProps;

export default SearchField;
