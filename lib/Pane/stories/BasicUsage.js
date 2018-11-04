/**
 * Pane: Basic Usage
 */

import React from 'react';
import Paneset from '../../Paneset';
import Pane from '../Pane';
import Button from '../../Button';
import Icon from '../../Icon';

const BasicUsage = () => (
  <div style={{ margin: '-1rem' }}>
    <Paneset>
      <Pane defaultWidth="20%" paneTitle="Filters">
        Pane Content
      </Pane>
      <Pane
        defaultWidth="fill"
        paneTitle="Search Results"
        lastMenu={<Button><Icon icon="plus-sign">New</Icon></Button>}
      >
        Pane Content
      </Pane>
    </Paneset>
  </div>
);

export default BasicUsage;
