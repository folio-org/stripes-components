import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import withReadme from 'storybook-readme/with-readme'; // eslint-disable-line import/no-extraneous-dependencies
import Readme from '../readme.md';
import BasicUsage from './BasicUsage';

storiesOf('AppIcon', module)
  .addDecorator(withReadme(Readme))
  .add('Basic Usage', () => <BasicUsage />);
