/**
 * AppIcon: Basic Usage
 */

import React from 'react';
import Headline from '../../Headline';
import AppIcon from '../AppIcon';

const testClickEvent = () => {
  console.log('Clicked!');
};

export default () => (
  <div style={{ padding: '15px' }}>
    <Headline>Block Icon (Clickable and focusable)</Headline>
    <AppIcon
      onClick={testClickEvent}
      iconSize="small"
    />
    <br /><br />
    <AppIcon
      onClick={testClickEvent}
      iconSize="medium"
    />
    <br /><br />
    <AppIcon
      onClick={testClickEvent}
      iconSize="large"
    />
    <br /><br />
    <hr />
    <br />
    <Headline>Inline Block Icon</Headline>
    <AppIcon
      active
      iconSize="small"
    /> Inline non-clickable icon (no onClick callback provided)
    <br />
    <br />
    <hr />
    <br />
    <Headline>App Icon with label</Headline>
    <AppIcon
      label="Users"
      onClick={testClickEvent}
    />
    <br />
    <br />
    <hr />
    <br />
    <Headline>Outline Icon</Headline>
    <AppIcon
      onClick={testClickEvent}
      iconSize="small"
      iconStyle="outline"
    />
    <br /><br />
    <AppIcon
      onClick={testClickEvent}
      iconSize="medium"
      iconStyle="outline"
    />
    <br /><br />
    <AppIcon
      active
      onClick={testClickEvent}
      iconSize="large"
      iconStyle="outline"
    />
  </div>
);
