import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import { storiesOf } from '@storybook/react';
import Readme from '../readme.md';
import BasicUsage from './BasicUsage';

storiesOf('Key Value', module)
  .addDecorator(withReadme(Readme))
  .add('Basic Usage', () => (<BasicUsage />));
