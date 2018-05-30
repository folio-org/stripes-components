import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import withReadme from 'storybook-readme/with-readme'; // eslint-disable-line import/no-extraneous-dependencies
import readme from '../readme.md';
import BasicUsage from './BasicUsage';

storiesOf('Info Popover', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', () => <BasicUsage />);
