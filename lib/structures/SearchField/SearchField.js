/**
 * SearchField
 *
 * A universal search field component
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omitProps from '../../../util/omitProps';
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
  onChangeIndex: PropTypes.func,
  searchableIndexes: PropTypes.arrayOf(
    PropTypes.object,
  ),
};

const defaultProps = {
  placeholder: 'Search..',
};

const SearchField = (props) => {
  let textField = null;

  const {
    placeholder,
    id,
    ariaLabel,
    value,
    onChange,
    clearSearchId,
    onClear,
    searchableIndexes,
    onChangeIndex,
    selectedIndex,
  } = props;

  // Clear search field
  const clearSearchField = () => {
    // Run callback onClear
    if (typeof onClear === 'function') {
      onClear();
    }
    // Focus field after clearing
    if (textField.input) {
      textField.input.focus();
    }
  };

  // Clear icon
  const clearIcon = (onClear && value) ? (<TextFieldIcon id={clearSearchId} onClick={clearSearchField} icon="clearX" />) : null;

  // Search icon
  const searchIcon = (<TextFieldIcon icon="search" />);

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
        input={
          {
            onChange: onChangeIndex,
          }
        }
      />
    );
  }

  // Wrapper styles
  const rootStyles = classNames(
    css.searchFieldWrap,
    { [css.hasSearchableIndexes]: hasSearchableIndexes },
  );

  // Clean props before spreading
  const cleanedProps = omitProps(props, ['clearSearchId', 'onClear', 'searchableIndexes', 'onChangeIndex', 'selectedIndex']);

  // Placeholder
  const inputPlaceholder = (hasSearchableIndexes && selectedIndex) ? `Search for ${selectedIndex}` : placeholder;

  return (
    <div className={rootStyles}>
      {searchableIndexesDropdown}
      <TextField
        id={id}
        ariaLabel={ariaLabel}
        value={value}
        onChange={onChange}
        endControl={clearIcon}
        startControl={!hasSearchableIndexes ? searchIcon : null}
        ref={(el) => { textField = el; }}
        inputClass={css.input}
        {...cleanedProps}
        placeholder={inputPlaceholder}
      />
    </div>
  );
};

SearchField.propTypes = propTypes;
SearchField.defaultProps = defaultProps;

export default SearchField;
