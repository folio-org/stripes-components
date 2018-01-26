/**
 * Headline: Basic Usage
 */

import React from 'react';
import IconButton from '../IconButton';
import Headline from '../../Headline';

const BasicUsage = () => (
  <div style={{ padding: '15px' }}>
    <Headline>Size: Medium (44x44px)</Headline>
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
    <Headline>Size: Small (24x24px)</Headline>
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
