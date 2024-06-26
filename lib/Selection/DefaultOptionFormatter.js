import React from 'react';
import PropTypes from 'prop-types';
import OptionSegment from './OptionSegment';

const propTypes = {
  option: PropTypes.object,
  searchTerm: PropTypes.string,
};

const DefaultOptionFormatter = ({ option, searchTerm }) => {
  return option ?
    <OptionSegment searchTerm={searchTerm}>{option.label}</OptionSegment> :
    null;
};

DefaultOptionFormatter.propTypes = propTypes;

export default DefaultOptionFormatter;
