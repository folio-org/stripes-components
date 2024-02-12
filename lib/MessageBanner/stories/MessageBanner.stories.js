import React from 'react';
import BasicUsage from './BasicUsage';
import Dismissible from './Dismissible';
import ShowHide from './ShowHide';

export default {
  title: 'MessageBanner',
};

export const _BasicUsage = BasicUsage;
export const _ShowHide = () => <ShowHide />;

_ShowHide.storyName = 'Show/hide';

export const _Dismissible = Dismissible;
