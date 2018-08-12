/**
 * Modal: With ModalFooter component
 */

import React from 'react';
import { action } from '@storybook/addon-actions';
import ModalFooter from '../ModalFooter';
import Modal from '../../Modal';

export default () => {
  const footer = (
    <ModalFooter
      primaryButton={{
        label: 'Save',
        onClick: action('You clicked save')
      }}
      secondaryButton={{
        label: 'Cancel',
        onClick: action('You clicked cancel')
      }}
    />
  );

  return (
    <Modal
      open
      label="Modal with ModalFooter"
      footer={footer}
    >
      Modal Content
    </Modal>
  );
};
