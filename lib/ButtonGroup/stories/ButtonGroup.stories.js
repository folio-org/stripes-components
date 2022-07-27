import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from '../readme.md';
import BasicUsage from './BasicUsage';

export default {
  title: 'ButtonGroup',
  decorators: [withReadme(Readme)],
};

export const _BasicUsage = () => <BasicUsage />;
