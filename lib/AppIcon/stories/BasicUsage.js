/**
 * AppIcon: Basic Usage
 */

import React from 'react';
import AppIcon from '../AppIcon';

export default () => (
  <div style={{ padding: '15px' }}>
    <AppIcon size="small" /> (placeholder)
    <br /><br />
    <AppIcon size="small">
      <img src="http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png" alt="" />
    </AppIcon>
    <br /><br />
    <AppIcon size="medium">
      <img src="http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png" alt="" />
    </AppIcon>
    <br /><br />
    <AppIcon size="large">
      <img src="http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png" alt="" />
    </AppIcon>
  </div>
);
