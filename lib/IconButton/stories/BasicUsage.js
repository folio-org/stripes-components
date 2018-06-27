/**
 * Headline: Basic Usage
 */

import React from 'react';
import IconButton from '../IconButton';
import Headline from '../../Headline';

const BasicUsage = () => (
  <div>
    <Headline margin="small">Size: Medium</Headline>
    <Headline faded size="small" margin="large">44x44px</Headline>
    <IconButton
      icon="closeX"
    />
    <IconButton
      icon="comment"
      badgeCount="9+"
    />
    <IconButton
      icon="search"
    />
    <IconButton
      icon="edit"
    />
    <IconButton
      icon="duplicate"
    />
    <br /><br /><br />
    <Headline margin="small">Size: Small</Headline>
    <Headline faded size="small" margin="large">24x24px</Headline>
    <IconButton
      size="small"
      icon="closeX"
    />
    <IconButton
      size="small"
      icon="comment"
      badgeCount="9+"
    />
    <IconButton
      size="small"
      icon="search"
    />
    <IconButton
      size="small"
      icon="edit"
    />
    <IconButton
      size="small"
      icon="duplicate"
    />
  </div>
);

export default BasicUsage;
