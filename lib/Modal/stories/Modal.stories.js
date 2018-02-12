import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import withReadme from 'storybook-readme/with-readme'; // eslint-disable-line import/no-extraneous-dependencies
import { withKnobs } from '@storybook/addon-knobs/react';
import Readme from '../readme.md';
import BasicUsage from './BasicUsage';

storiesOf('Modal', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(Readme))
  .add('Basic Usage', () => <BasicUsage />);
