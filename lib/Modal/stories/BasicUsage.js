/**
 * Modal: Basic Usage
 */

import React, { Fragment } from 'react';
import { text, boolean, select } from '@storybook/addon-knobs/react';
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
      dismissible={dismissible}
      label={label}
      size={size}
      showHeader={showHeader}
      onClose={() => alert('onClose callback')} // eslint-disable-line no-alert
      footer={footer}
    >
      Modal Content
    </Modal>
  );
};
