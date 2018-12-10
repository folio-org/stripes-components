import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import BasicUsage from './BasicUsage';

storiesOf('UI|IconButton', module)
  .addDecorator(withReadme(readme))
  .addDecorator(withKnobs)
  .add('Basic Usage', () => <BasicUsage />);
