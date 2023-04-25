import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import BasicUsage from './BasicUsage';

export default {
  title: 'Layout',
  decorators: [withReadme(readme)],
};

export const AvailableClasses = () => <BasicUsage />;

AvailableClasses.story = {
  name: 'Available classes',
};
