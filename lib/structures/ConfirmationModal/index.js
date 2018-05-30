import React from 'react';
import ConfirmationModal from '../../ConfirmationModal';

export default function (props) {
  console.warn('Warning: ConfirmationModal has moved out of the structures directory. Update path to stripes-components/lib/ConfirmationModal.');
  return (
    <ConfirmationModal {...props} />
  );
}
