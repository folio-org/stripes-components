import React from 'react';
import SearchField from '../../SearchField';

export default function (props) {
  console.warn('Warning: SearchField has moved out of the structures directory. Update path to stripes-components/lib/SearchField.');
  return (
    <SearchField {...props} />
  );
}
