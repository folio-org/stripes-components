/**
 * Icon: icon position example
 */

import React from 'react';
import Icon from '../Icon';

export default () => (
  <>
    <Icon
      icon="trash"
      aria-label="trash icon"
    >
      {'iconPosition="start" (default)'}
    </Icon>
    <br />
    <br />
    <Icon
      icon="trash"
      iconPosition="end"
    >
      {'iconPosition="end"'}
    </Icon>
  </>
);
