import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { withReadme } from 'storybook-readme'; // eslint-disable-line import/no-extraneous-dependencies
import readme from './readme.md';
import stories from './stories';

storiesOf('Multi Column List', module)
  .addDecorator(withReadme(readme))
  .add('General', stories.general);
