import React from 'react';
import { withReadme } from 'storybook-readme';
import readme from '../readme.md';
import BasicUsage from './BasicUsage';

export default {
  title: 'Card',
  decorators: [withReadme(readme)],
};

export const _BasicUsage = () => <BasicUsage />;
