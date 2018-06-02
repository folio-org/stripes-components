import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import { withKnobs } from '@storybook/addon-knobs/react';
import Readme from '../readme.md';
import BasicUsage from './BasicUsage';

storiesOf('Modal', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(Readme))
  .add('Basic Usage', () => <BasicUsage />);
