import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';

import readme from '../readme.md';
import BasicUsage from './BasicUsage';
import PaneHeader from './PaneHeader';

storiesOf('Pane', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', () => <BasicUsage />)
  .add('Pane Header', () => <PaneHeader />);
