/**
 * Pane: Basic Usage
 */

import React from 'react';
import Paneset from '../../Paneset';
import PaneMenu from '../../PaneMenu';
import Pane from '../Pane';
import { Button, IconButton } from '../../Button';

const firstMenu = (
  <PaneMenu>
    <IconButton key="icon-search" icon="search" />
  </PaneMenu>
);

const lastMenu = (
  <PaneMenu>
    <IconButton key="icon-comment" icon="comment" />
    <IconButton key="icon-edit" icon="edit" />
  </PaneMenu>
);
// const lastMenu = (
//   <PaneMenu>
//     <IconButton key="icon-search" icon="search" />
//     <IconButton key="icon-comment" icon="comment" />
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
