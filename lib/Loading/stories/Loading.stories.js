import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from '../readme.md';
import Loading from '../Loading';
import LoadingView from '../LoadingView';
import LoadingPane from './LoadingPane.story';

export default {
  title: 'Loading',
  decorators: [withReadme(Readme)],
};

export const LoadingSpinner = () => <Loading />;
export const _LoadingPane = () => <LoadingPane />;
export const _LoadingView = () => <LoadingView paneTitle="Loading view animation" />;
