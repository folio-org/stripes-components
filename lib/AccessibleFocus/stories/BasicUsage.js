/**
 * Accessible Focus: Basic Usage
 */

import React from 'react';
import AccessibleFocus from '../AccessibleFocus';

export default () => (
  <div style={{ padding: '15px' }}>
    <AccessibleFocus tag="button" style={{ padding: '5px 10px' }}>
      <span>Label!</span>
    </AccessibleFocus>

    <div style={{ position: 'relative' }}>
      <input type="text" />
      <AccessibleFocus />
    </div>
  </div>
);
