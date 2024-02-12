import React from 'react';
import Loading from '../Loading';
import LoadingView from '../LoadingView';
import LoadingPane from './LoadingPane.story';

export default {
  title: 'Loading',
};

export const LoadingSpinner = () => <Loading />;
export const _LoadingPane = () => <LoadingPane />;
export const _LoadingView = () => <LoadingView paneTitle="Loading view animation" />;
