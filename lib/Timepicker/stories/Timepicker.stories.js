import React from 'react';
import { storiesOf } from '@storybook/react';
import BasicUsage from './BasicUsage';

storiesOf('Timepicker', module)
  .add('Basic Usage', () => (<BasicUsage />));
