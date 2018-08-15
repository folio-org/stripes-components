/**
 * Icon Story: Basic Usage
 */

import React from 'react';
import { select } from '@storybook/addon-knobs';
import Icon from '../Icon';
import icons from '../icons';
import css from './style.css';

export default () => {
  const size = select('Size', { small: 'Small', medium: 'Medium', large: 'Large' }, 'large');
  const status = select('Status', { warn: 'Warning', error: 'Error', success: 'Success', none: 'None' }, 'none');

  return (
    <Icon
      size={size}
      icon="trashBin"
      status={status}
    >
        Delete
    </Icon>
  );
};
