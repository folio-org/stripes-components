import React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import readme from '../readme.md';
import BasicUsage from './BasicUsage';


storiesOf('Card', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', () => (<BasicUsage />));
