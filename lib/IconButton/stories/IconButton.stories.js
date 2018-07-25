import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import withReadme from 'storybook-readme/with-readme';
import Readme from '../readme.md';
import BasicUsage from './BasicUsage';

storiesOf('IconButton', module)
  .addDecorator(withReadme(Readme))
  .addDecorator(withKnobs)
  .add('Basic Usage', () => <BasicUsage />);
