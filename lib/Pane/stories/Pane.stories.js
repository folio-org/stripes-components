import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';

import readme from '../readme.md';
import BasicUsage from './BasicUsage';

import PaneHeaderReadme from '../../PaneHeader/readme.md';
import PaneHeader from './PaneHeader';

import PaneMenuReadme from '../../PaneMenu/readme.md';

storiesOf('Pane', module)
  .add('Basic Usage', withReadme(readme, () => <BasicUsage />))
  .add('PaneHeader', withReadme(PaneHeaderReadme, () => <PaneHeader />))
  .add('PaneMenu', withReadme(PaneMenuReadme, () => <PaneHeader />));
