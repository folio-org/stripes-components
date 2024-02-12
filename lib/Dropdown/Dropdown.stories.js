import React from 'react';
import { action } from '@storybook/addon-actions';
import stories from './stories';
import Dropdown from './Dropdown';
import Button from '../Button/Button';
import DropdownMenu from '../DropdownMenu/DropdownMenu';

export default {
  title: 'Dropdown',
};

export const Default = () => <stories.defaultButton />;

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

export const Controlled = () => <stories.controlled />;
export const Toggleable = () => <stories.toggleable />;
export const ObjectRenderFncSyntax = () => <stories.objectSyntax />;

ObjectRenderFncSyntax.storyName = 'Object/render fnc syntax';

export const Controls = () => <stories.layout />;
export const UsePortal = () => <stories.usePortal />;
