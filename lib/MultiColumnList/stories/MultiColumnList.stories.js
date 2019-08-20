import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import readme from '../readme.md';
import BasicMCL from './BasicMCL';
import Autosize from './Autosize';
import MaxHeightVirtualized from './MaxHeightVirtualized';
import ColumnWidths from './ColumnWidths';
import Static from './Static';
import AddItem from './AddItem';
import CheckboxSelect from './CheckboxSelect';
import ColumnChooser from './ColumnChooser';
import EndOfListMarker from './EndOfListMarker';

storiesOf('MultiColumnList', module)
  .addDecorator(withReadme(readme))
  .addDecorator(withKnobs)
  .add('Basic Usage', () => <BasicMCL />)
  .add('Autosize', () => <Autosize />)
  .add('Max height, virtualized', () => <MaxHeightVirtualized />)
  .add('End of list marker', () => <EndOfListMarker />)
  .add('Column widths', () => <ColumnWidths />)
  .add('Static height', () => <Static />)
  .add('Add Items', () => <AddItem />)
  .add('CheckboxSelect', () => <CheckboxSelect />)
  .add('Column chooser', () => <ColumnChooser />);
