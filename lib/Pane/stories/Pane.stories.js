import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';

import readme from '../readme.md';
import BasicUsage from './BasicUsage';

import PaneHeaderReadme from '../../PaneHeader/readme.md';
import PaneHeader from './PaneHeader';

import PaneBackLinkReadme from '../../PaneBackLink/readme.md';
import PaneBackLinkBasicUsage from '../../PaneBackLink/stories/BasicUsage';

import PaneCloseLinkReadme from '../../PaneCloseLink/readme.md';
import PaneCloseLinkBasicUsage from '../../PaneCloseLink/stories/BasicUsage';

import PaneMenuReadme from '../../PaneMenu/readme.md';

storiesOf('Pane', module)
  .add('Basic Usage', withReadme(readme, () => <BasicUsage />))
  .add('PaneHeader', withReadme(PaneHeaderReadme, () => <PaneHeader />))
  .add('PaneMenu', withReadme(PaneMenuReadme, () => <PaneHeader />))
  .add('PaneBackLink', withReadme(PaneBackLinkReadme, () => <PaneBackLinkBasicUsage />))
  .add('PaneCloseLink', withReadme(PaneCloseLinkReadme, () => <PaneCloseLinkBasicUsage />));
