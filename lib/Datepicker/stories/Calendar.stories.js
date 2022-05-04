import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';

import BasicUsage from './CalendarBasicUsage';
import readme from '../calendar-readme.md';

storiesOf('Calendar', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', () => (<BasicUsage />));
