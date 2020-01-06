import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import Readme from '../readme.md';
import Loading from '../Loading';
import LoadingView from '../LoadingView';
import LoadingPane from './LoadingPane.story';

storiesOf('Loading', module)
  .addDecorator(withReadme(Readme))
  .add('Loading Spinner', () => <Loading />)
  .add('Loading Pane', () => <LoadingPane />)
  .add('Loading View', () => <LoadingView paneTitle="Loading view animation" />);
