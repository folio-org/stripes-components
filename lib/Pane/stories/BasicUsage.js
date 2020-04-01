/**
 * Pane: Basic Usage
 */

import React from 'react';
import Paneset from '../../Paneset';
import Pane from '../Pane';
import PaneHeader from '../../PaneHeader';

const BasicUsage = () => (
  <div style={{ margin: '-1rem' }}>
    <Paneset>
      <Pane
        defaultWidth="20%"
        renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Filters" />}
      >
        Pane Content
      </Pane>
      <Pane
        containerize
        defaultWidth="fill"
        renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Search Results" />}
      >
        Pane Content
      </Pane>
    </Paneset>
  </div>
);

export default BasicUsage;
