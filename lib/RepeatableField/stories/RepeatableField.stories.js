import React from 'react';
import BasicUsage from './BasicUsage';
import MultipleColumns from './MultipleColumns';
import CustomRemoveButton from './CustomRemoveButton';

export default {
  title: 'RepeatableField',
};

export const _BasicUsage = () => <BasicUsage />;
export const _CustomRemoveButton = () => <CustomRemoveButton />;

_CustomRemoveButton.storyName = 'Custom remove button';

export const _MultipleColumns = () => <MultipleColumns />;

_MultipleColumns.storyName = 'Multiple columns';
