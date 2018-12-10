import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';

import readme from '../readme.md';
import BasicUsage from './BasicUsage';

addDecorator(withReadme(readme));

storiesOf('Form|Timepicker', module)
  .add('Basic Usage', () => (<BasicUsage />));
