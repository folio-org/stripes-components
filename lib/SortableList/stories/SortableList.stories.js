import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';

import BasicUsage from './BasicUsage';
import readme from '../readme.md';

storiesOf('SortableList', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', () => (<BasicUsage />));
