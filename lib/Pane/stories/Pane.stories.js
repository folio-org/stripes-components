import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import Readme from '../readme.md';
import BasicUsage from './BasicUsage';
import PaneHeader from './PaneHeader';

storiesOf('Pane', module)
  .addDecorator(withReadme(Readme))
  .add('Basic Usage', () => <BasicUsage />)
  .add('Pane Header', () => <PaneHeader />);
