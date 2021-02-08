import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextArea from '../../../TextArea';

const defaultStyle = {
  height: '20px',
  resize: 'none',
};

const propTypes = {
  onChange: PropTypes.func,
  searchButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  style: PropTypes.object,
};

const MultiSelectSearch = props => {
  const {
    onChange,
    searchButtonRef = {},
    style = defaultStyle,
  } = props;

  const [searchTerms, setSearchTerms] = useState('');

  const handleSearchTermsChange = event => {
    onChange(event);
    setSearchTerms(event.target.value);
  };

  const handleKeyDown = event => {
    switch (event.keyCode) {
      case 13: // enter
        event.preventDefault();
        if (searchButtonRef.current) {
          searchButtonRef.current.click();
        }
        break;
      default:
    }
  };

  return (
    <TextArea
      style={style}
      marginBottom0
      value={searchTerms}
      onChange={handleSearchTermsChange}
      onKeyDown={handleKeyDown}
    />
  );
};

MultiSelectSearch.propTypes = propTypes;

export default MultiSelectSearch;
