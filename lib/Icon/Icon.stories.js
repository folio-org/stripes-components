import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import withReadme from 'storybook-readme/with-readme'; // eslint-disable-line import/no-extraneous-dependencies
import { withKnobs } from '@storybook/addon-knobs';
import Readme from './readme.md';
import stories from './stories';

storiesOf('Icon', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(Readme))
  .add('Basic Usage', () => <stories.BasicUsage />);
