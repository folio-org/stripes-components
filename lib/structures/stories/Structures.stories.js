import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import withReadme from 'storybook-readme/with-readme'; // eslint-disable-line import/no-extraneous-dependencies

import SearchFieldUsage from './SearchFieldUsage';
import SearchFieldReadme from '../SearchField/readme.md';

import InfoPopoverUsage from '../InfoPopover/stories/BasicUsage';
import InfoPopoverReadme from '../InfoPopover/readme.md';

import EmptyMessageUsage from '../EmptyMessage/stories/BasicUsage';
import EmptyMessageReadme from '../EmptyMessage/readme.md';

storiesOf('structures', module)
  .add('SearchField', withReadme(SearchFieldReadme, () => <SearchFieldUsage />))
  .add('InfoPopover', withReadme(InfoPopoverReadme, () => <InfoPopoverUsage />))
  .add('EmptyMessage', withReadme(EmptyMessageReadme, () => <EmptyMessageUsage />));
