import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import withReadme from 'storybook-readme/with-readme'; // eslint-disable-line import/no-extraneous-dependencies

import SearchFieldUsage from './SearchFieldUsage';
import SearchFieldReadme from '../SearchField/readme.md';

import InfoPopoverUsage from '../InfoPopover/stories/BasicUsage';
import InfoPopoverReadme from '../InfoPopover/readme.md';

storiesOf('structures', module)
  .add('SearchField', withReadme(SearchFieldReadme, () => <SearchFieldUsage />))
  .add('InfoPopover', withReadme(InfoPopoverReadme, () => <InfoPopoverUsage />));
