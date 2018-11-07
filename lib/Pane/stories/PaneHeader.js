/**
 * Pane: Basic Usage
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import Paneset from '../../Paneset';
import PaneMenu from '../../PaneMenu';
import Pane from '../Pane';
import IconButton from '../../IconButton';
import NavListItem from '../../NavListItem';
import NavList from '../../NavList';
import Icon from '../../Icon';

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

const actionMenu = ({ onToggle }) => ( // eslint-disable-line
  <div>
    <NavList>
      <NavListItem onClick={onToggle}>
        <Icon size="small" icon="eye-open">View</Icon>
      </NavListItem>
      <NavListItem onClick={onToggle}>
        <Icon size="small" icon="edit">Edit</Icon>
      </NavListItem>
      <NavListItem onClick={onToggle}>
        <Icon size="small" icon="duplicate">Duplicate</Icon>
      </NavListItem>
    </NavList>
  </div>
);

const PaneHeaderExample = () => (
  <div style={{ margin: '-1rem' }}>
    <Paneset>
      <Pane defaultWidth="20%" paneTitle="Filters" dismissible onClose={() => {}}>
        Some content..
      </Pane>
      <Pane
        actionMenu={actionMenu}
        firstMenu={firstMenu}
        lastMenu={lastMenu}
        defaultWidth="fill"
        paneTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        paneSub="121 results found"
        onClose={() => {}}
      >
        Some content..
      </Pane>
    </Paneset>
  </div>
);

export default PaneHeaderExample;
