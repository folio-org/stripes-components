import React from 'react';
import SearchField from '../../SearchField';

export default function (props) {
  console.warn('Warning: SearchField has moved. Update path to stripes-components/lib/SearchField.');
  return (
    <SearchField {...props} />
  );
}
