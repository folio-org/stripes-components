/**
 * Headline: Basic Usage
 */

import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import IconButton from '../IconButton';
import Headline from '../../Headline';

const BasicUsage = () => {
  const disabled = boolean('Disabled', false);

  return (
    <div>
      <Headline margin="small">Size: Medium</Headline>
      <IconButton
        icon="times"
        disabled={disabled}
        aria-label="close"
      />
      <IconButton
        icon="comment"
        disabled={disabled}
        badgeCount="9+"
      />
      <IconButton
        icon="search"
        disabled={disabled}
      />
      <IconButton
        icon="edit"
        disabled={disabled}
      />
      <IconButton
        icon="duplicate"
        disabled={disabled}
      />
      <br />
      <br />
      <br />
      <Headline margin="small">Size: Small</Headline>
      <IconButton
        size="small"
        icon="times"
        disabled={disabled}
      />
      <IconButton
        size="small"
        icon="comment"
        disabled={disabled}
        badgeCount="9+"
      />
      <IconButton
        size="small"
        icon="search"
        disabled={disabled}
      />
      <IconButton
        size="small"
        icon="edit"
        disabled={disabled}
      />
      <IconButton
        size="small"
        icon="duplicate"
        disabled={disabled}
      />
    </div>
  );
};

export default BasicUsage;
