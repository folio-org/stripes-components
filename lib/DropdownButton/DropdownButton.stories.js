import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import DropdownButton from './DropdownButton';
import stories from './stories';
import readme from './readme.md';


storiesOf('DropdownButton', module)
  .addDecorator(withReadme(readme))
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
