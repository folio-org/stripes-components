import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import readme from '../readme.md';
import stories from './index';

storiesOf('Button', module)
  .add('General', withReadme(readme.general, stories.general))
  .add('Styles', withReadme(readme.styles, stories.styles))
  .add('Sizes', withReadme(readme.sizes, stories.sizes));
