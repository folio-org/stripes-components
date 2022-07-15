import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import readme from './readme.md';
import stories from './stories';

export default {
  title: 'FilterGroups',
  decorators: [withReadme(readme)],
};

export const Basic = () => <stories.basic />;
