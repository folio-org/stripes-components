import React from 'react';
import { storiesOf } from '@storybook/react';
import withReadme from 'storybook-readme/with-readme';
import readme from '../readme.md';
import BasicUsage from './BasicUsage';
import DropdownExample from './DropdownExample';

storiesOf('UI|MenuSection', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', BasicUsage)
  .add('Inside Dropdown', () => <DropdownExample />);
