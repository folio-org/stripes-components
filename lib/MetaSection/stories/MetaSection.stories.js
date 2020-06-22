import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import BasicUsage from './BasicUsage';

storiesOf('MetaSection', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', BasicUsage);
