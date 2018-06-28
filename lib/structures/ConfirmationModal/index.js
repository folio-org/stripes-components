import React from 'react';
import ConfirmationModal from '../../ConfirmationModal';

export default function (props) {
  console.warn('Warning: ConfirmationModal has moved. Update path to stripes-components/lib/ConfirmationModal.');
  return (
    <ConfirmationModal {...props} />
  );
}
