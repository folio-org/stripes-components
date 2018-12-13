import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import withReadme from 'storybook-readme/with-readme';
import readme from './readme.md';
import stories from './stories';
import Dropdown from './Dropdown';
import Button from '../Button/Button';
import DropdownMenu from '../DropdownMenu/DropdownMenu';

storiesOf('Dropdown', module)
  .addDecorator(withReadme(readme))
  .add('Open', () => (
    <Dropdown
      open
      onToggle={action('onToggle')}
    >
      <Button
        data-role="toggle"
        aria-haspopup="true"
      >
       Toggle Dropdown
      </Button>
      <DropdownMenu
        data-role="menu"
        aria-label="available options"
        onToggle={action('onToggle')}
      >
        <ul>
          <li>Example 1</li>
          <li>Example 2</li>
        </ul>
      </DropdownMenu>
    </Dropdown>
  ))
  .add('Closed', () => (
    <Dropdown open={false}>
      <Button>
        Toggle Dropdown
      </Button>
    </Dropdown>
  ))
  .add('Toggleable', withReadme(readme, () => <stories.toggleable />));
