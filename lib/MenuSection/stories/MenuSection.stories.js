import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import BasicUsage from './BasicUsage';
import DropdownExample from './DropdownExample';

export default {
  title: 'MenuSection',
  decorators: [withReadme(readme)],
};

export const _BasicUsage = BasicUsage;
export const InsideDropdown = () => <DropdownExample />;
