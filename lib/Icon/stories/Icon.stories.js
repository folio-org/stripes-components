import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import { withKnobs } from '@storybook/addon-knobs';
import Readme from '../readme.md';
import stories from './index';

storiesOf('Icon', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(Readme))
  .add('Basic Usage', () => <stories.BasicUsage />);
