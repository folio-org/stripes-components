import React from 'react';
import BasicUsage from './BasicUsage';
import WithQueryBuilder from './WithQueryBuilder';

export default {
  title: 'AdvancedSearch',
};

export const WithDefaults = () => <BasicUsage />;

WithDefaults.storyName = 'with defaults';

export const WithCustomQueryBuilder = () => <WithQueryBuilder />;

WithCustomQueryBuilder.storyName = 'with custom queryBuilder';
