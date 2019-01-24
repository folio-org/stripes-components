/**
 * PaneHeader: Basic Usage
 */
import React, { Fragment } from 'react';
import Paneset from '../../Paneset';
import PaneMenu from '../../PaneMenu';
import Pane from '../../Pane/Pane';
import PaneHeaderIconButton from '../../PaneHeaderIconButton';
import Button from '../../Button';
import MenuSection from '../../MenuSection';
import RadioButton from '../../RadioButton';
import Checkbox from '../../Checkbox';
import Icon from '../../Icon';

const firstMenu = (
  <PaneMenu>
    <PaneHeaderIconButton key="icon-search" icon="search" />
  </PaneMenu>
);

const lastMenu = (
  <PaneMenu>
    <PaneHeaderIconButton key="icon-comment" icon="comment" />
    <PaneHeaderIconButton key="icon-edit" icon="edit" />
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
      >
        Some content..
      </Pane>
    </Paneset>
  </div>
);

export default PaneHeaderIconButtonExample;
