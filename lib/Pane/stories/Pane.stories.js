import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';

import readme from '../readme.md';
import BasicUsage from './BasicUsage';
import UsingContainerize from './UsingContainerize';

import PaneHeaderReadme from '../../PaneHeader/readme.md';
import PaneHeaderBasicUsage from '../../PaneHeader/stories/BasicUsage';

import PaneBackLinkReadme from '../../PaneBackLink/readme.md';
import PaneBackLinkBasicUsage from '../../PaneBackLink/stories/BasicUsage';

import PaneCloseLinkReadme from '../../PaneCloseLink/readme.md';
import PaneCloseLinkBasicUsage from '../../PaneCloseLink/stories/BasicUsage';

import PaneHeaderIconButtonReadme from '../../PaneHeaderIconButton/readme.md';
import PaneHeaderIconButtonBasicUsage from '../../PaneHeaderIconButton/stories/BasicUsage';

import PaneMenuReadme from '../../PaneMenu/readme.md';

import WithPaneFooterReadme from '../../PaneFooter/readme.md';
import WithPaneFooter from '../../PaneFooter/stories/BasicUsage';

import PaneSubheaderExample from '../../PaneSubheader/stories/PaneSubheaderExample';

storiesOf('Pane', module)
  .add('Basic Usage', withReadme(readme, () => <BasicUsage />))
  .add('Using containerize', withReadme(readme, () => <UsingContainerize />))
  .add('PaneHeader', withReadme(PaneHeaderReadme, () => <PaneHeaderBasicUsage />))
  .add('PaneMenu', withReadme(PaneMenuReadme, () => <PaneHeaderBasicUsage />))
  .add('PaneHeaderIconButton', withReadme(PaneHeaderIconButtonReadme, () => <PaneHeaderIconButtonBasicUsage />))
  .add('PaneBackLink', withReadme(PaneBackLinkReadme, () => <PaneBackLinkBasicUsage />))
  .add('PaneCloseLink', withReadme(PaneCloseLinkReadme, () => <PaneCloseLinkBasicUsage />))
  .add('PaneFooter', withReadme(WithPaneFooterReadme, () => <WithPaneFooter />))
  .add('PaneSubHeader', () => <PaneSubheaderExample />);
