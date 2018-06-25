import React from 'react';
import { storiesOf } from '@storybook/react';
import BasicUsage from './BasicUsage';

storiesOf('Datepicker', module)
  .add('Basic Usage', () => (<BasicUsage />));
