import withReadme from 'storybook-readme/with-readme';
import BasicUsage from './BasicUsage';
import readme from '../Readme.md';

export default {
  title: 'TextField',
  decorators: [withReadme(readme)],
};

export const _BasicUsage = BasicUsage;
