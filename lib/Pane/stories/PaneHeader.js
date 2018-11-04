/**
 * Pane: Basic Usage
 */
import React from 'react';
import { action } from '@storybook/addon-actions';
import Paneset from '../../Paneset';
import PaneMenu from '../../PaneMenu';
import Pane from '../Pane';
import Button from '../../Button';
import Icon from '../../Icon';

const firstMenu = (
  <PaneMenu>
    <Button buttonStyle="plain">
      <Icon icon="search" />
    </Button>
  </PaneMenu>
);

const lastMenu = (
  <PaneMenu>
    <Button buttonStyle="plain">
      <Icon icon="comment" />
    </Button>
    <Button buttonStyle="plain">
      <Icon icon="edit" />
    </Button>
  </PaneMenu>
);

const actionMenuItems = [
  {
    label: 'Edit',
    onClick: () => {
      action('click!');
    },
  },
  {
    label: 'Bookmark',
    href: '#hello',
  },
  {
    label: 'Export',
    href: '#export',
  },
];

const PaneHeaderExample = () => (
  <div style={{ margin: '-1rem' }}>
    <Paneset>
      <Pane defaultWidth="20%" paneTitle="Filters" dismissible onClose={() => {}}>
        Some content..
      </Pane>
      <Pane
        actionMenuItems={actionMenuItems}
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
