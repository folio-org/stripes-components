import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import Readme from '../readme.md';

import ScrollableExample from './ScrollableExample';
import ScrollableReadme from '../Scrollable/readme.md';

storiesOf('Utility', module)
  .add('Scrollable', withReadme(ScrollableReadme, () => <ScrollableExample />));
