import React from 'react';
import withReadme from 'storybook-readme/with-readme';

import BasicUsage from './BasicUsage';
import readme from '../readme.md';

export default {
  title: 'Datepicker',
  decorators: [withReadme(readme)],
};

export const _BasicUsage = () => <BasicUsage />;
