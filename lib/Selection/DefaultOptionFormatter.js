import React from 'react';
import PropTypes from 'prop-types';
import OptionSegment from './OptionSegment';

const propTypes = {
  option: PropTypes.object,
  searchTerm: PropTypes.string,
};

const DefaultOptionFormatter = ({ option, searchTerm }) => {
  if (option) {
    return <OptionSegment searchTerm={searchTerm}>{option.label}</OptionSegment>;
  }

  return null;
};

DefaultOptionFormatter.propTypes = propTypes;

export default DefaultOptionFormatter;
