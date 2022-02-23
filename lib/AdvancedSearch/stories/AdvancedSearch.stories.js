import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import Readme from '../readme.md';
import BasicUsage from './BasicUsage';
import WithQueryBuilder from './WithQueryBuilder';

storiesOf('AdvancedSearch', module)
  .addDecorator(withReadme(Readme))
  .add('with defaults', () => <BasicUsage />)
  .add('with custom queryBuilder', () => <WithQueryBuilder />);
