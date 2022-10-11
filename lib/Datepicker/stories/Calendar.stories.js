import React from 'react';
import withReadme from 'storybook-readme/with-readme';

import BasicUsage from './CalendarBasicUsage';
import readme from '../calendar-readme.md';

export default {
  title: 'Calendar',
  decorators: [withReadme(readme)],
};

export const _BasicUsage = () => <BasicUsage />;
