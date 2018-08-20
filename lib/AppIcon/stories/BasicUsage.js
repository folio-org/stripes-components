/**
 * AppIcon: Basic Usage
 */

import React from 'react';
import AppIcon from '../AppIcon';
import src from './app_icon_large.png';

export default () => (
  <div>
    <AppIcon size="small">
      With label
    </AppIcon>
    <br />
    <br />
    <AppIcon size="small" icon={{ src }} />
    <br />
    <br />
    <AppIcon size="medium" icon={{ src }} />
    <br />
    <br />
    <AppIcon size="large" icon={{ src }} />
  </div>
);
