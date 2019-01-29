import React from 'react';
import { storiesOf } from '@storybook/react';
import DropdownButton from './DropdownButton';
import stories from './stories';


storiesOf('DropdownButton', module)
  .add('Open', () => (
    <DropdownButton open>
      Toggle Dropdown
    </DropdownButton>
  ))
  .add('Closed', () => (
    <DropdownButton>
      Toggle Dropdown
    </DropdownButton>
  ))
  .add('With dropdown', () => <stories.withDropdown />)
  .add('With UncontrolledDropdown', () => <stories.withUncontrolledDropdown />);
