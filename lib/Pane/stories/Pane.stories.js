import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';

import readme from '../readme.md';
import BasicUsage from './BasicUsage';

import PaneHeaderReadme from '../../PaneHeader/readme.md';
import PaneHeaderBasicUsage from '../../PaneHeader/stories/BasicUsage';

import PaneBackLinkReadme from '../../PaneBackLink/readme.md';
import PaneBackLinkBasicUsage from '../../PaneBackLink/stories/BasicUsage';

import PaneCloseLinkReadme from '../../PaneCloseLink/readme.md';
import PaneCloseLinkBasicUsage from '../../PaneCloseLink/stories/BasicUsage';

import PaneHeaderIconButtonReadme from '../../PaneHeaderIconButton/readme.md';
import PaneHeaderIconButtonBasicUsage from '../../PaneHeaderIconButton/stories/BasicUsage';

import PaneMenuReadme from '../../PaneMenu/readme.md';

storiesOf('Pane', module)
  .add('Basic Usage', withReadme(readme, () => <BasicUsage />))
  .add('PaneHeader', withReadme(PaneHeaderReadme, () => <PaneHeaderBasicUsage />))
  .add('PaneMenu', withReadme(PaneMenuReadme, () => <PaneHeaderBasicUsage />))
  .add('PaneHeaderIconButton', withReadme(PaneHeaderIconButtonReadme, () => <PaneHeaderIconButtonBasicUsage />))
  .add('PaneBackLink', withReadme(PaneBackLinkReadme, () => <PaneBackLinkBasicUsage />))
  .add('PaneCloseLink', withReadme(PaneCloseLinkReadme, () => <PaneCloseLinkBasicUsage />));
