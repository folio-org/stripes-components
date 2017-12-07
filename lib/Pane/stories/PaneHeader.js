/**
 * Pane: Basic Usage
 */

import React from 'react';
import Paneset from '../../Paneset';
import PaneMenu from '../../PaneMenu';
import { PaneMenuIcon } from '../../PaneMenu';
import Pane from '../Pane';

const firstMenu = (
  <PaneMenu>
    <button>hello</button>
  </PaneMenu>
);

const lastMenu = (
  <PaneMenu>
    <PaneMenuIcon icon="search" />
    <PaneMenuIcon icon="comment" />
  </PaneMenu>
);

const PaneHeaderExample = () => (
  <Paneset>
    <Pane defaultWidth="20%" paneTitle="Filters" dismissible onClose={() => {}}>
      Some content..
    </Pane>
    <Pane lastMenu={lastMenu} defaultWidth="fill" paneTitle="Search Results" dismissible onClose={() => {}}>
      Some content..
    </Pane>
  </Paneset>
);

export default PaneHeaderExample;
