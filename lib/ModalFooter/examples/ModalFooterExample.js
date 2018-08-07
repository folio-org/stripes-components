/**
 * Modal: With ModalFooter component
 */

/* eslint-disable */
import React from 'react';
import { action } from '@storybook/addon-actions';
import ModalFooter from '../ModalFooter';
import Button from '../../Button';
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
      open={true}
      label="Modal with ModalFooter"
      footer={footer}
    >
      Modal Content
    </Modal>
  );
};
