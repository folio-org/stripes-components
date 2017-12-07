/**
 * Pane: Basic Usage
 */

import React from 'react';
import Paneset from '../../Paneset';
import Pane from '../Pane';

const BasicUsage = () => (
  <Paneset>
    <Pane defaultWidth="20%" paneTitle="Filters">
      Pane Content
    </Pane>
    <Pane defaultWidth="fill" paneTitle="Search Results">
      Pane Content
    </Pane>
  </Paneset>
);

export default BasicUsage;
