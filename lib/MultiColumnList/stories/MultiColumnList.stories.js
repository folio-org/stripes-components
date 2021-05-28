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
import Formatter from './Formatter';
import PagingType from './PagingType';
import Resizing from './Resizing';
import ClickableRows from './ClickableRows';
import ColumnWidthHints from './ColumnWidthHints';
import PrevNextPaging from './PrevNextPaging';
import ItemToView from './ItemToView';

storiesOf('MultiColumnList', module)
  .addDecorator(withReadme(readme))
  .addDecorator(withKnobs)
  .add('Basic Usage', () => <BasicMCL />)
  .add('Autosize', () => <Autosize />)
  .add('Formatter', () => <Formatter />)
  .add('Item-To-View', () => <ItemToView />)
  .add('Max height, virtualized', () => <MaxHeightVirtualized />)
  .add('End of list marker', () => <EndOfListMarker />)
  .add('Column widths', () => <ColumnWidths />)
  .add('Column width hints', () => <ColumnWidthHints />)
  .add('Static height', () => <Static />)
  .add('Add Items', () => <AddItem />)
  .add('CheckboxSelect', () => <CheckboxSelect />)
  .add('Column chooser', () => <ColumnChooser />)
  .add('Load More Paging', () => <PagingType />)
  .add('Prev/Next Paging', () => <PrevNextPaging />)
  .add('Resizing', () => <Resizing />)
  .add('Clickable rows', () => <ClickableRows />);
