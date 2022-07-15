import React from 'react';
import withReadme from 'storybook-readme/with-readme';

import readme from '../readme.md';
import BasicUsage from './BasicUsage';
import UsingCenterContent from './UsingCenterContent';

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

import AddRemovePane from './AddRemovePane';
import OnLayout from './onLayout';
import InitialLayouts from './initialLayouts';

export default {
  title: 'Pane',
};

export const _3PanesLayer = () => <AddRemovePane />;

_3PanesLayer.story = {
  name: '3 Panes + Layer',
};

export const _InitialLayouts = () => <InitialLayouts />;

_InitialLayouts.story = {
  name: 'Initial layouts',
};

export const _OnLayout = () => <OnLayout />;

_OnLayout.story = {
  name: 'OnLayout',
};

export const _BasicUsage = withReadme(readme, () => <BasicUsage />);
export const _UsingCenterContent = withReadme(readme, () => <UsingCenterContent />);

_UsingCenterContent.story = {
  name: 'Using centerContent',
};

export const PaneHeader = withReadme(PaneHeaderReadme, () => <PaneHeaderBasicUsage />);

PaneHeader.story = {
  name: 'PaneHeader',
};

export const PaneMenu = withReadme(PaneMenuReadme, () => <PaneHeaderBasicUsage />);

PaneMenu.story = {
  name: 'PaneMenu',
};

export const PaneHeaderIconButton = withReadme(PaneHeaderIconButtonReadme, () => (
  <PaneHeaderIconButtonBasicUsage />
));

PaneHeaderIconButton.story = {
  name: 'PaneHeaderIconButton',
};

export const PaneBackLink = withReadme(PaneBackLinkReadme, () => <PaneBackLinkBasicUsage />);

PaneBackLink.story = {
  name: 'PaneBackLink',
};

export const PaneCloseLink = withReadme(PaneCloseLinkReadme, () => <PaneCloseLinkBasicUsage />);

PaneCloseLink.story = {
  name: 'PaneCloseLink',
};

export const PaneFooter = withReadme(WithPaneFooterReadme, () => <WithPaneFooter />);

PaneFooter.story = {
  name: 'PaneFooter',
};

export const PaneSubHeader = () => <PaneSubheaderExample />;

PaneSubHeader.story = {
  name: 'PaneSubHeader',
};
