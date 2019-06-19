import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import BasicUsage from './BasicUsage';
import MultipleColumns from './MultipleColumns';
import CustomRemoveButton from './CustomRemoveButton';

storiesOf('RepeatableField', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', () => <BasicUsage />)
  .add('Custom remove button', () => <CustomRemoveButton />)
  .add('Multiple columns', () => <MultipleColumns />);
