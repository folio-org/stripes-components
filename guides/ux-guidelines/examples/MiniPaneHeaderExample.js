import React from 'react';
import Button from '../../../lib/Button';
import Checkbox from '../../../lib/Checkbox';
import MenuSection from '../../../lib/MenuSection';
import Pane from '../../../lib/Pane';
import PaneHeader from '../../../lib/PaneHeader';
import Paneset from '../../../lib/Paneset';
import RadioButton from '../../../lib/RadioButton';

const actionMenu = ({ onToggle }) => (
  <>
    <MenuSection label="Layout">
      <RadioButton name="layout" label="Automatic layout" />
      <RadioButton name="layout" label="Table layout" />
    </MenuSection>
    <MenuSection label="Columns">
      <Checkbox label="Title" />
      <Checkbox label="Type" />
      <Checkbox label="Status" />
    </MenuSection>
    <MenuSection label="Actions">
      <Button buttonStyle="dropdownItem" onClick={onToggle}>Refresh</Button>
    </MenuSection>
  </>
);

export default function MiniPaneHeaderExample() {
  return (
    <div style={{ margin: '-1rem' }}>
      <Paneset>
        <Pane
          defaultWidth="fill"
          renderHeader={(renderProps) => (
            <PaneHeader
              {...renderProps}
              paneTitle="Instances"
              paneSub="121 results found"
              actionMenu={actionMenu}
              onClose={() => { }}
            />
          )}
        >
          Pane content
        </Pane>
      </Paneset>
    </div>
  );
}
