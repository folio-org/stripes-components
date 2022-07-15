import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from '../readme.md';
import BasicUsage from './BasicUsage';
import WithQueryBuilder from './WithQueryBuilder';

export default {
  title: 'AdvancedSearch',
  decorators: [withReadme(Readme)],
};

export const WithDefaults = () => <BasicUsage />;

WithDefaults.story = {
  name: 'with defaults',
};

export const WithCustomQueryBuilder = () => <WithQueryBuilder />;

WithCustomQueryBuilder.story = {
  name: 'with custom queryBuilder',
};
