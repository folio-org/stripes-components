import React from 'react';
import { action } from '@storybook/addon-actions';
import withReadme from 'storybook-readme/with-readme';
import readme from './readme.md';
import stories from './stories';
import Dropdown from './Dropdown';
import Button from '../Button/Button';
import DropdownMenu from '../DropdownMenu/DropdownMenu';

export default {
  title: 'Dropdown',
  decorators: [withReadme(readme)],
};

export const Default = withReadme(readme, () => <stories.defaultButton />);

export const Open = () => (
  <Dropdown
    open
    onToggle={action('onToggle')}
    renderTrigger={({ getTriggerProps }) => <Button {...getTriggerProps()}>Open dropdown</Button>}
    renderMenu={() => (
      <DropdownMenu data-role="menu" aria-label="available options" onToggle={action('onToggle')}>
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
);

export const Closed = () => (
  <Dropdown
    open={false}
    onToggle={action('onToggle')}
    renderTrigger={({ getTriggerProps }) => <Button {...getTriggerProps()}>Closed dropdown</Button>}
    renderMenu={() => (
      <DropdownMenu data-role="menu" aria-label="available options" onToggle={action('onToggle')}>
        <ul>
          <li>Example 1</li>
          <li>Example 2</li>
        </ul>
      </DropdownMenu>
    )}
  />
);

export const Controlled = withReadme(readme, () => <stories.controlled />);
export const Toggleable = withReadme(readme, () => <stories.toggleable />);
export const ObjectRenderFncSyntax = withReadme(readme, () => <stories.objectSyntax />);

ObjectRenderFncSyntax.story = {
  name: 'Object/render fnc syntax',
};

export const Controls = withReadme(readme, () => <stories.layout />);
export const UsePortal = withReadme(readme, () => <stories.usePortal />);
