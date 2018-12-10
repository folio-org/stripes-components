import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import BasicUsage from './BasicUsage';
import readme from '../readme.md';

storiesOf('Form|TextField', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', BasicUsage);
