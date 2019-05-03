import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import BasicUsage from './BasicUsage';
import Readme from '../readme.md';

storiesOf('Editor', module)
  .addDecorator(withReadme(Readme))
  .add('Basic Usage', BasicUsage);
