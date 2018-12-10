import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import readme from '../readme.md';
import stories from './index';


storiesOf('Form|Button', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', stories.general)
  .add('Styles', stories.styles)
  .add('Sizes', stories.sizes);
