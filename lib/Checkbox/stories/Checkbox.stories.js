import React from 'react';
import { storiesOf } from '@storybook/react';
import BasicUsage from './BasicUsage';

storiesOf('Checkbox', module)
  .add('Basic Usage', () => (<BasicUsage />));
