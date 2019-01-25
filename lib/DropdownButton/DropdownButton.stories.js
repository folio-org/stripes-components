import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DropdownButton from './DropdownButton';
import stories from './stories';


storiesOf('DropdownButton', module)
  .add('Open', () => (
    <DropdownButton
      open
      onToggle={action('onToggle')}
      buttonContent="Toggle dropdown"
    >
      <ul>
        <li>Example</li>
        <li>Of using</li>
        <li>DropdownButton</li>
      </ul>
    </DropdownButton>
  ))
  .add('Closed', () => (
    <DropdownButton
      onToggle={action('onToggle')}
      buttonContent="Toggle dropdown"
    >
      <span>Will not be shown</span>
    </DropdownButton>
  ))
  .add('Togglable', () => (<stories.togglable />));
