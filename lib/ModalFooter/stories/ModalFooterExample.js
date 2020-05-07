/**
 * Modal: With ModalFooter component
 */

import React from 'react';
import { action } from '@storybook/addon-actions';
import ModalFooter from '../ModalFooter';
import Modal from '../../Modal';
import Button from '../../Button';

export default () => {
  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={action('You clicked save')}
      >
        Save
      </Button>
      <Button onClick={action('You clicked cancel')}>
        Cancel
      </Button>
    </ModalFooter>
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
