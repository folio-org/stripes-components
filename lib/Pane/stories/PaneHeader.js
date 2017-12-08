/**
 * Pane: Basic Usage
 */

import React from 'react';
import Paneset from '../../Paneset';
import PaneMenu, { PaneMenuIcon } from '../../PaneMenu';
import Pane from '../Pane';
import Button from '../../Button';

const firstMenu = (
  <PaneMenu>
    <PaneMenuIcon key="icon-search" icon="search" />
  </PaneMenu>
);

const lastMenu = (
  <PaneMenu>
    <PaneMenuIcon key="icon-comment" icon="comment" />
    <PaneMenuIcon key="icon-edit" icon="edit" />
  </PaneMenu>
);
// const lastMenu = (
//   <PaneMenu>
//     <PaneMenuIcon key="icon-search" icon="search" />
//     <PaneMenuIcon key="icon-comment" icon="comment" />
//   </PaneMenu>
// );

const PaneHeaderExample = () => (
  <Paneset>
    <Pane defaultWidth="20%" paneTitle="Filters" dismissible onClose={() => {}}>
      Some content..
    </Pane>
    <Pane firstMenu={firstMenu} lastMenu={lastMenu} defaultWidth="fill" paneTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry." paneSub="121 results found" onClose={() => {}}>
      Some content..
    </Pane>
  </Paneset>
);

export default PaneHeaderExample;
