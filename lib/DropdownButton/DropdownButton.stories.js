import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import stories from './stories';
import readme from './readme.md';


storiesOf('DropdownButton', module)
  .addDecorator(withReadme(readme))
  .add('Basic usage', () => <stories.basicUsage />);
