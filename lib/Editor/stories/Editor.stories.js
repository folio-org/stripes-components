import withReadme from 'storybook-readme/with-readme';
import BasicUsage from './BasicUsage';
import Readme from '../readme.md';

export default {
  title: 'Editor',
  decorators: [withReadme(Readme)],
};

export const _BasicUsage = BasicUsage;
