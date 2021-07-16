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
  .add('Default', withReadme(readme, () => <stories.defaultButton />))
  .add('Open', () => (
    <Dropdown
      open
      onToggle={action('onToggle')}
      renderTrigger={({ getTriggerProps }) => (
        <Button
          {...getTriggerProps()}
        >
          Open dropdown
        </Button>
      )}
      renderMenu={() => (
        <DropdownMenu
          data-role="menu"
          aria-label="available options"
          onToggle={action('onToggle')}
        >
          <ul>
            <li>Example 1</li>
            <li>Example 2</li>
            <li>Example 1</li>
            <li>Example 2</li>
            <li>Example 1</li>
            <li>Example 2</li>
            <li>Example 1</li>
            <li>Example 2</li>
            <li>Example 1</li>
            <li>Example 2</li>
          </ul>
        </DropdownMenu>
      )}
    />
  ))
  .add('Closed', () => (
    <Dropdown
      open={false}
      onToggle={action('onToggle')}
      renderTrigger={({ getTriggerProps }) => (
        <Button
          {...getTriggerProps()}
        >
          Closed dropdown
        </Button>
      )}
      renderMenu={() => (
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
      )}
    />
  ))
  .add('Controlled', withReadme(readme, () => <stories.controlled />))
  .add('Toggleable', withReadme(readme, () => <stories.toggleable />))
  .add('Object/render fnc syntax', withReadme(readme, () => <stories.objectSyntax />))
  .add('Controls', withReadme(readme, () => <stories.layout />))
  .add('Use Portal', withReadme(readme, () => <stories.usePortal />));
