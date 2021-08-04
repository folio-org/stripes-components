/**
 * Modal: Basic Usage
 */

import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import Modal from '../Modal';
import Button from '../../Button';

export default () => {
  // const showHeader = boolean('Show header', true);
  // const dismissible = boolean('Dismissible', true);
  // const label = text('Label', 'Modal Label');
  // const size = select('Size', {
  //   small: 'Small',
  //   medium: 'Medium',
  //   large: 'Large',
  // }, 'medium');

  const footer = (
    <>
      <Button buttonStyle="primary" marginBottom0>Save</Button>
    </>
  );

  return (
    <Modal
      open
      id="basic-modal-example"
      dismissible
      closeOnBackgroundClick
      label={'Modal label'}
      size={'Medium'}
      showHeader
      onClose={action('onClose callback')}
      footer={footer}
      aria-label="Example Modal"
    >
      Modal Content
    </Modal>
  );
};
