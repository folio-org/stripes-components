import React from 'react';
import BasicUsage from './BasicUsage';
import CommandListUsage from './CommandList';

export default {
  title: 'HotKeys',
};

export const _BasicUsage = () => <BasicUsage />;
export const CommandList = () => <CommandListUsage />;

CommandList.storyName = 'CommandList';
