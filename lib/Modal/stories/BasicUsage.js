/**
 * Modal: Basic Usage
 */

import React, { useState } from 'react';
import { action } from 'storybook/actions';
import Modal from '../Modal';
import Button from '../../Button';

export default () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    action('onClose callback')();
    setOpen(false);
  };

  const footer = (
    <>
      <Button buttonStyle="primary" marginBottom0 onClick={handleClose}>Save</Button>
    </>
  );

  return (
    <div>
      <Button buttonStyle="primary" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        id="basic-modal-example"
        dismissible
        closeOnBackgroundClick
        label={'Modal label'}
        size={'Medium'}
        showHeader
        onClose={handleClose}
        footer={footer}
        aria-label="Example Modal"
      >
        Modal Content
      </Modal>
    </div>
  );
};
