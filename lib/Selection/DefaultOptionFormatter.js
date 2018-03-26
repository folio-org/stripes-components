import React from 'react';
import OptionSegment from './OptionSegment';

const DefaultOptionFormatter = ({ option, searchTerm }) => {
  return (
    <OptionSegment searchTerm={searchTerm} >{option.label}</OptionSegment>
  );
}

export default DefaultOptionFormatter;
