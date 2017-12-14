import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import Readme from './readme.md';
import stories from './stories';

storiesOf('Filter Groups', module)
  .addDecorator(withReadme(Readme))
  .add('Basic', () => <stories.basic />);
