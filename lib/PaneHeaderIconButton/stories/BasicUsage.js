/**
 * PaneHeader: Basic Usage
 */
import React from 'react';
import Paneset from '../../Paneset';
import PaneMenu from '../../PaneMenu';
import Pane from '../../Pane/Pane';
import PaneHeaderIconButton from '../PaneHeaderIconButton';

const firstMenu = (
  <PaneMenu>
    <PaneHeaderIconButton icon="search" />
  </PaneMenu>
);

const lastMenu = (
  <PaneMenu>
    <PaneHeaderIconButton icon="comment" badgeCount={5} />
    <PaneHeaderIconButton icon="archive" />
    <PaneHeaderIconButton icon="edit" />
  </PaneMenu>
);

const PaneHeaderIconButtonExample = () => (
  <div style={{ margin: '-1rem' }}>
    <Paneset>
      <Pane
        firstMenu={firstMenu}
        lastMenu={lastMenu}
        defaultWidth="fill"
        paneTitle="PaneHeaderIconButton example"
      />
    </Paneset>
  </div>
);

export default PaneHeaderIconButtonExample;
