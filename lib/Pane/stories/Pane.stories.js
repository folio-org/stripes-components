import React from 'react';

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
import MCLPartial from './MCLPartial';

export default {
  title: 'Pane',
};

export const _3PanesLayer = () => <AddRemovePane />;

_3PanesLayer.storyName = '3 Panes + Layer';

export const _InitialLayouts = () => <InitialLayouts />;

_InitialLayouts.storyName = 'Initial layouts';

export const _OnLayout = () => <OnLayout />;

_OnLayout.storyName = 'OnLayout';

export const _BasicUsage = () => <BasicUsage />;
export const _UsingCenterContent = () => <UsingCenterContent />;

_UsingCenterContent.storyName = 'Using centerContent';

export const PaneHeader = () => <PaneHeaderBasicUsage />;

PaneHeader.storyName = 'PaneHeader';

export const PaneMenu = () => <PaneHeaderBasicUsage />;

PaneMenu.storyName = 'PaneMenu';

export const PaneHeaderIconButton = () => (
  <PaneHeaderIconButtonBasicUsage />
);

PaneHeaderIconButton.storyName = 'PaneHeaderIconButton';

export const PaneBackLink = () => <PaneBackLinkBasicUsage />;

PaneBackLink.storyName = 'PaneBackLink';

export const PaneCloseLink = () => <PaneCloseLinkBasicUsage />;

PaneCloseLink.storyName = 'PaneCloseLink';

export const PaneFooter = () => <WithPaneFooter />;

PaneFooter.storyName = 'PaneFooter';

export const PaneSubHeader = () => <PaneSubheaderExample />;

PaneSubHeader.storyName = 'PaneSubHeader';

export const MCLPartialStory = () => <MCLPartial />;

MCLPartialStory.storyName = 'MCL Partial layout';
