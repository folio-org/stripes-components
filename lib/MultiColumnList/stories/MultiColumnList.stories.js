import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import readme from '../readme.md';
import BasicMCL from './BasicMCL';
import NoTotalVirtualized from './NoTotalVirtualized';
import ColumnWidths from './ColumnWidths';

storiesOf('MultiColumnList', module)
  .addDecorator(withReadme(readme))
  .addDecorator(withKnobs)
  .add('Basic Usage', () => <BasicMCL />)
  .add('Virtualized, no total count', () => <NoTotalVirtualized />)
  .add('Column widths', () => <ColumnWidths />);