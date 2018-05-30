import React from 'react';
import AddressView from '../../../AddressFieldGroup/AddressView';

export default function (props) {
  console.warn('Warning: AddressView has moved out of the structures directory. Update path to stripes-components/lib/AddressFieldGroup/AddressView.');
  return (
    <AddressView {...props} />
  );
}
