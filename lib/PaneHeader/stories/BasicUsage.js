/**
 * PaneHeader: Basic Usage
 */
import React, { Fragment } from 'react';
import Paneset from '../../Paneset';
import PaneMenu from '../../PaneMenu';
import Pane from '../../Pane/Pane';
import PaneHeaderIconButton from '../../PaneHeaderIconButton';
import PaneHeader from '../../PaneHeader';
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
      <Pane
        defaultWidth="20%"
        renderHeader={renderProps => (
          <PaneHeader
            {...renderProps}
            paneTitle="Filters"
            dismissible
            onClose={() => {}}
          />
        )}
      >
        Some content..
      </Pane>
      <Pane
        defaultWidth="fill"
        renderHeader={renderProps => (
          <PaneHeader
            {...renderProps}
            actionMenu={actionMenu}
            firstMenu={firstMenu}
            lastMenu={lastMenu}
            onClose={() => {}}
            paneSub="121 results found"
            paneTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />
        )}
      >
        Some content..
      </Pane>
    </Paneset>
  </div>
);

export default PaneHeaderExample;
