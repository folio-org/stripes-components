import React from 'react';
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
import PrevNextOffsetPaging from './PrevNextOffsetPaging';
import ItemToView from './ItemToView';
import StickyColumns from './StickyColumns';
import VariableWidthHints from './VariableWidthHints';
import WithInputs from './WithInputs';
import VirtualizeStatic from './VirtualizedStatic';

export default {
  title: 'MultiColumnList',
};

export const BasicUsage = () => <BasicMCL />;
export const _Autosize = () => <Autosize />;
export const _Formatter = () => <Formatter />;
export const _ItemToView = () => <ItemToView />;

_ItemToView.storyName = 'Item-To-View';

export const _MaxHeightVirtualized = () => <MaxHeightVirtualized />;

_MaxHeightVirtualized.storyName = 'Max height, virtualized';

export const _EndOfListMarker = () => <EndOfListMarker />;

_EndOfListMarker.storyName = 'End of list marker';

export const _ColumnWidths = () => <ColumnWidths />;

_ColumnWidths.storyName = 'Column widths';

export const _VariableWidthHints = () => <VariableWidthHints />;

_VariableWidthHints.storyName = 'Variable Column Hints';

export const _ColumnWidthHints = () => <ColumnWidthHints />;

_ColumnWidthHints.storyName = 'Column width hints';

export const StaticHeight = () => <Static />;

StaticHeight.storyName = 'Static height';

export const AddItems = () => <AddItem />;
export const _CheckboxSelect = () => <CheckboxSelect />;

_CheckboxSelect.storyName = 'CheckboxSelect';

export const _ColumnChooser = () => <ColumnChooser />;

_ColumnChooser.storyName = 'Column chooser';

export const LoadMorePaging = () => <PagingType />;
export const _PrevNextPaging = () => <PrevNextPaging />;

_PrevNextPaging.storyName = 'Prev/Next Paging';

export const _Resizing = () => <Resizing />;
export const _ClickableRows = () => <ClickableRows />;

_ClickableRows.storyName = 'Clickable rows';

export const _StickyColumns = () => <StickyColumns />;
export const _WithInputs = () => <WithInputs />;

_WithInputs.storyName = 'With Inputs';

export const _PrevNextOffsetPaging = () => <PrevNextOffsetPaging />;
_PrevNextOffsetPaging.storyName = 'Prev/Next Offset';

export const _VirtualizedStatic = () => <VirtualizeStatic />;
_VirtualizedStatic.storyName = 'Virtualized Static';
