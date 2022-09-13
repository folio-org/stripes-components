import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import BasicUsage from './BasicUsage';

export default {
  title: 'Popover',
  decorators: [withReadme(readme)],
};

export const _BasicUsage = () => <BasicUsage />;
