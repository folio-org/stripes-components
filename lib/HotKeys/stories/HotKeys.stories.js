import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import BasicUsage from './BasicUsage';
import CommandListUsage from './CommandList';

export default {
  title: 'HotKeys',
  decorators: [withReadme(readme)],
};

export const _BasicUsage = () => <BasicUsage />;
export const CommandList = () => <CommandListUsage />;

CommandList.story = {
  name: 'CommandList',
};
