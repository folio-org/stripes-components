/**
 * Modal: Basic Usage
 */

import React, { Fragment } from 'react';
import { text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import Modal from '../Modal';
import Button from '../../Button';

export default () => {
  const open = boolean('Open', true);
  const showHeader = boolean('Show header', true);
  const dismissible = boolean('Dismissible', true);
  const label = text('Label', 'Modal Label');
  const size = select('Size', {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  }, 'medium');

  const footer = (
    <Fragment>
      <Button buttonStyle="primary" marginBottom0>Save</Button>
    </Fragment>
  );

  return (
    <Modal
      open={open}
      id="basic-modal-example"
      dismissible={dismissible}
      label={label}
      size={size}
      showHeader={showHeader}
      onClose={action('onClose callback')}
      footer={footer}
      aria-label="Example Modal"
    >
      Modal Content
    </Modal>
  );
};
