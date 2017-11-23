import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { withReadme } from 'storybook-readme'; // eslint-disable-line import/no-extraneous-dependencies
import readme from './readme.md';
import stories from './stories';

storiesOf('Multi Column List', module)
  .addDecorator(withReadme(readme))
  .addDecorator(withKnobs)
  .add('Basic Usage', () => <stories.basic />);
