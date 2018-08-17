/**
 * Headline: Basic Usage
 */

import React from 'react';
import { boolean } from '@storybook/addon-knobs/react';
import IconButton from '../IconButton';
import Headline from '../../Headline';

const BasicUsage = () => {
  const disabled = boolean('Disabled', false);

  return (
    <div>
      <Headline margin="small">Size: Medium</Headline>
      <Headline faded size="small" margin="large">44x44px</Headline>
      <IconButton
        icon="closeX"
        disabled={disabled}
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
      <Headline faded size="small" margin="large">24x24px</Headline>
      <IconButton
        size="small"
        icon="closeX"
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
