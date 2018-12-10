import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import readme from './readme.md';
import stories from './stories';

storiesOf('UI|FilterGroups', module)
  .addDecorator(withReadme(readme))
  .add('Basic', () => <stories.basic />);
