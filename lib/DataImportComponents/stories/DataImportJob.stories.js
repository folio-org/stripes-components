/**
 * Data import job card Example
 */

import React from 'react';
import withReadme from 'storybook-readme/with-readme';

import readme from '../Job/readme.md';
import BasicUsage from './BasicUsage';

export default {
  title: 'Data Import Components',
  decorators: [withReadme(readme)],
};

export const JobExample = () => <BasicUsage />;

JobExample.story = {
  name: 'Job Example',
};
