/**
 * Accessible Focus: Basic Usage
 */

import React from 'react';
import AccessibleFocus from '../AccessibleFocus';
import Headline from '../../Headline';

const SimpleButton = () => <button onClick={() => console.log('yo')}>Hello</button>;

export default () => (
  <div style={{ padding: '15px' }}>
    <Headline>A simple focusable button</Headline>
    <AccessibleFocus component="button" style={{ padding: '5px 15px', border: '1px solid #cecece', borderRadius: '6px' }}>
      <span>Hello World</span>
    </AccessibleFocus>

    <br /><br /><br />

    <Headline>A simple button with a focusable inner element</Headline>
    <button style={{ position: 'relative', padding: '15px 25px', outline: 0, backgroundColor: '#e4e4e4' }}>
      <AccessibleFocus style={{ padding: '0px 5px' }}>
        <span>Hello World</span>
      </AccessibleFocus>
    </button>

    <br /><br /><br />

    <Headline>A simple focusable button</Headline>
    <AccessibleFocus component={SimpleButton} style={{ padding: '5px 15px', border: '1px solid #cecece', 'border-radius': '6px' }}>
      <span>Hello World</span>
    </AccessibleFocus>
  </div>
);
