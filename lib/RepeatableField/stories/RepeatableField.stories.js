import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import BasicUsage from './BasicUsage';
import MultipleColumns from './MultipleColumns';
import CustomRemoveButton from './CustomRemoveButton';

export default {
  title: 'RepeatableField',
  decorators: [withReadme(readme)],
};

export const _BasicUsage = () => <BasicUsage />;
export const _CustomRemoveButton = () => <CustomRemoveButton />;

_CustomRemoveButton.story = {
  name: 'Custom remove button',
};

export const _MultipleColumns = () => <MultipleColumns />;

_MultipleColumns.story = {
  name: 'Multiple columns',
};
