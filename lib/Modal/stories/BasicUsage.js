/**
 * Modal: Basic Usage
 */

import React from 'react';
import { text, boolean, select } from '@storybook/addon-knobs/react';
import Modal from '../Modal';

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

  return (
    <Modal
      open={open}
      dismissible={dismissible}
      label={label}
      size={size}
      showHeader={showHeader}
      onClose={() => alert('onClose callback')} // eslint-disable-line no-alert
    >
      Modal Content
    </Modal>
  );
};
