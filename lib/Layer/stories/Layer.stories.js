import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import BasicUsage from './BasicUsage';

storiesOf('Layer', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', () => (<BasicUsage />));
