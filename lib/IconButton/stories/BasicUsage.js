/**
 * Headline: Basic Usage
 */

import React from 'react';
import IconButton from '../IconButton';

const BasicUsage = () => (
  <div style={{ padding: '15px' }}>
    <IconButton
      icon="comment"
      badgeCount={3}
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
