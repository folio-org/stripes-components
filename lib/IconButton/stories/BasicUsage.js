/**
 * Headline: Basic Usage
 */

import React from 'react';
import IconButton from '../IconButton';

const BasicUsage = () => (
  <div>
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
  </div>
);

export default BasicUsage;
