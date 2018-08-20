/**
 * AppIcon: Basic Usage
 */

import React from 'react';
import AppIcon from '../AppIcon';

export default () => (
  <div>
    <AppIcon size="small">
      With label
    </AppIcon>
    <br />
    <br />
    <AppIcon size="small" icon={{ src: 'http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png' }} />
    <br />
    <br />
    <AppIcon size="medium" icon={{ src: 'http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png' }} />
    <br />
    <br />
    <AppIcon size="large" icon={{ src: 'http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png' }} />
  </div>
);
