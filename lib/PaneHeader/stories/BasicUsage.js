/**
 * PaneHeader: Basic Usage
 */
import React, { Fragment } from 'react';
import Paneset from '../../Paneset';
import PaneMenu from '../../PaneMenu';
import Pane from '../../Pane/Pane';
import IconButton from '../../IconButton';
import Button from '../../Button';
import MenuSection from '../../MenuSection';
import RadioButton from '../../RadioButton';
import Checkbox from '../../Checkbox';
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
  <Fragment>
    <MenuSection label="Layout">
      <RadioButton name="layout" label="Automatic layout" />
      <RadioButton name="layout" label="Always use table layout" />
      <RadioButton name="layout" label="Always use cards layout" />
    </MenuSection>
    <MenuSection label="Columns">
      <Checkbox label="ID" />
      <Checkbox label="Name" />
      <Checkbox label="Email" />
      <Checkbox label="Phone" />
    </MenuSection>
    <MenuSection label="Actions">
      <Button buttonStyle="dropdownItem" onClick={onToggle}>
        <Icon size="small" icon="eye-open">
          View
        </Icon>
      </Button>
      <Button buttonStyle="dropdownItem" onClick={onToggle}>
        <Icon size="small" icon="edit">
          Edit
        </Icon>
      </Button>
      <Button buttonStyle="dropdownItem" onClick={onToggle}>
        <Icon size="small" icon="duplicate">
          Duplicate
        </Icon>
      </Button>
    </MenuSection>
  </Fragment>
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
        appIcon={{
          app: 'inventory',
          key: 'holdings',
        }}
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
