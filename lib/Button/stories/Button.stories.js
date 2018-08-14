import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import readme from '../readme.md';
import stories from './index';

storiesOf('Button', module)
  .add('General', withReadme(readme, stories.general))
  .add('Styles', withReadme(readme, stories.styles))
  .add('Sizes', withReadme(readme, stories.sizes));
