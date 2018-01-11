/**
 * SearchField
 *
 * A universal search field component
 */

import React from 'react';
import PropTypes from 'prop-types';
import omitProps from '../../../util/omitProps';
import TextField from '../../TextField';
import TextFieldIcon from '../../TextField/TextFieldIcon';

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
  const cleanedProps = omitProps(props, ['clearSearchId', 'onClear']);

  return (
    <TextField
      placeholder={placeholder}
      id={id}
      ariaLabel={ariaLabel}
      value={value}
      onChange={onChange}
      startControl={searchIcon}
      endControl={clearIcon}
      ref={(el) => { textField = el; }}
      {...cleanedProps}
    />
  );
};

// Accepts the same props as TextField
SearchField.propTypes = {
  placeholder: PropTypes.string,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  clearSearchId: PropTypes.string,
  onClear: PropTypes.func,
};

SearchField.defaultProps = {
  placeholder: 'Search..',
};

export default SearchField;
