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

  // Clean props before spreading
  const cleanedProps = omitProps(props, ['clearSearchId', 'onClear', 'searchableIndexes', 'onChangeIndex']);

  /**
   * Search field has searchable indexes dropdown
   */
  let searchableIndexesDropdown;
  const hasSearchableIndexes = Array.isArray(searchableIndexes);

  if (hasSearchableIndexes) {
    searchableIndexesDropdown = (
      <Select
        dataOptions={searchableIndexes}
      />
    );
  }

  const rootStyles = classNames(
    css.searchFieldWrap,
    { [css.hasSearchableIndexes]: hasSearchableIndexes },
  );

  return (
    <div className={rootStyles}>
      {searchableIndexesDropdown}
      <TextField
        placeholder={placeholder}
        id={id}
        ariaLabel={ariaLabel}
        value={value}
        onChange={onChange}
        endControl={clearIcon}
        ref={(el) => { textField = el; }}
        {...cleanedProps}
      />
    </div>
  );
};

SearchField.propTypes = propTypes;
SearchField.defaultProps = defaultProps;

export default SearchField;
