/**
 * Modal: With ModalFooter component
 */

/* eslint-disable */
import React from 'react';
import ModalFooter from '@folio/stripes-components/lib/ModalFooter';
import Button from '@folio/stripes-components/lib/Button';
import Modal from '@folio/stripes-components/lib/Modal';

export default () => {
  const footer = (
    <ModalFooter
      primaryButton={{
        label: 'Save',
        onClick: () => alert('You clicked save'),
      }}
      secondaryButton={{
        label: 'Cancel',
        onClick: () => alert('You clicked cancel'),
      }}
    />
  );

  return (
    <Modal
      open={true}
      label="Modal with ModalFooter"
      footer={footer}
    >
      Modal Content
    </Modal>
  );
};
