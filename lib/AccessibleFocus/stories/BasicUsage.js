/**
 * Accessible Focus: Basic Usage
 */

import React from 'react';
import AccessibleFocus from '../AccessibleFocus';
import AccessibleFocusHoC from '../AccessibleFocusHoC';
const Test = AccessibleFocusHoC(() => (<button>Hello</button>));

export default () => (
  <div style={{ padding: '15px' }}>
    <AccessibleFocus tag="button" style={{ padding: '5px 10px' }}>
      <span>Label!</span>
    </AccessibleFocus>

    <div style={{position: 'relative'}}>
      <input type="text" />
      <AccessibleFocus />
    </div>
    <Test />

  </div>
);
