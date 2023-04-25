import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import stories from './stories';
import readme from './readme.md';

export default {
  title: 'DropdownButton',
  decorators: [withReadme(readme)],
};

export const BasicUsage = () => <stories.basicUsage />;

BasicUsage.story = {
  name: 'Basic usage',
};
