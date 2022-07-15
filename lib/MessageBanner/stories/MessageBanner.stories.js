import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import BasicUsage from './BasicUsage';
import Dismissable from './Dismissable';
import ShowHide from './ShowHide';
import readme from '../readme.md';

export default {
  title: 'MessageBanner',
  decorators: [withReadme(readme)],
};

export const _BasicUsage = BasicUsage;
export const _ShowHide = () => <ShowHide />;

_ShowHide.story = {
  name: 'Show/hide',
};

export const _Dismissable = Dismissable;
