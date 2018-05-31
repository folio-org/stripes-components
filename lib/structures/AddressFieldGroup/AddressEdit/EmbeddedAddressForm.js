import React from 'react';
import EmbeddedAddressForm from '../../../AddressFieldGroup/AddressEdit/EmbeddedAddressForm';

export default function (props) {
  console.warn('Warning: EmbeddedAddressForm has moved out of the structures directory. Update path to stripes-components/lib/AddressFieldGroup/AddressEdit/EmbeddedAddressForm.');
  return (
    <EmbeddedAddressForm {...props} />
  );
}
