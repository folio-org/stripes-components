import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import BasicUsage from './BasicUsage';
import Dismissable from './Dismissable';
import ShowHide from './ShowHide';
import readme from '../readme.md';

storiesOf('MessageBanner', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', BasicUsage)
  .add('Show/hide', () => <ShowHide />)
  .add('Dismissable', Dismissable);
