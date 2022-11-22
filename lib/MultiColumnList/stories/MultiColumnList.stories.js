import React from 'react';
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
import StickyColumns from './StickyColumns';

export default {
  title: 'MultiColumnList',
  decorators: [withReadme(readme)],
};

export const BasicUsage = () => <BasicMCL />;
export const _Autosize = () => <Autosize />;
export const _Formatter = () => <Formatter />;
export const _ItemToView = () => <ItemToView />;

_ItemToView.story = {
  name: 'Item-To-View',
};

export const _MaxHeightVirtualized = () => <MaxHeightVirtualized />;

_MaxHeightVirtualized.story = {
  name: 'Max height, virtualized',
};

export const _EndOfListMarker = () => <EndOfListMarker />;

_EndOfListMarker.story = {
  name: 'End of list marker',
};

export const _ColumnWidths = () => <ColumnWidths />;

_ColumnWidths.story = {
  name: 'Column widths',
};

export const _ColumnWidthHints = () => <ColumnWidthHints />;

_ColumnWidthHints.story = {
  name: 'Column width hints',
};

export const StaticHeight = () => <Static />;

StaticHeight.story = {
  name: 'Static height',
};

export const AddItems = () => <AddItem />;
export const _CheckboxSelect = () => <CheckboxSelect />;

_CheckboxSelect.story = {
  name: 'CheckboxSelect',
};

export const _ColumnChooser = () => <ColumnChooser />;

_ColumnChooser.story = {
  name: 'Column chooser',
};

export const LoadMorePaging = () => <PagingType />;
export const _PrevNextPaging = () => <PrevNextPaging />;

_PrevNextPaging.story = {
  name: 'Prev/Next Paging',
};

export const _Resizing = () => <Resizing />;
export const _ClickableRows = () => <ClickableRows />;

_ClickableRows.story = {
  name: 'Clickable rows',
};

export const _StickyColumns = () => <StickyColumns />;