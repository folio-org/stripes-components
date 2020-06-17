# SortableList
Multi column list component with ability to sort rows via drag-and-drop.

## Usage
```
import { SortableList } from '@folio/stripes/components';

// later in your JSX
<SortableList
    onDragEnd={handleDragEnd}
    contentData={[
        {
            id: 'id_0',
        },
        {
            id: 'id_1',
        },
    ]}
/>

```

`SortableList` component acts as a wrapper for `MultiColumnList` component and defines a custom row formatter with drag-and-drop functionality. Drag-and-drop is implemented using `react-beautiful-dnd` library.

## Props

Name | type | description | default | required
--- | --- | --- | --- | ---
`droppableId` | string | Droppable area id for `react-beautiful-dnd`.| `uniqueId('droppable')` |
`id` | string | id for `MultiColumnList` wrapper element. | `uniqueId('sortable-list-')` |
`className` | string | className for `MultiColumnList` wrapper element. | '' |
`isRowDraggable` | func | Callback fired for each row. Returning `false` would disable dragging of a specific row. | `() => true` |
`onDragEnd` | func | Callback that signals end of drag-and-drop. | `noop` |
`onDragStart` | func | Callback that signals start of drag-and-drop. | `noop` |
`onDragUpdate` | func | Callback that signals updates from drag-and-drop. | `noop` |
`rowFormatter` | func | `rowFormatter` prop from `MultiColumnList` component. Can be passed to define a custom rowFormatter | `draggableRowFormatter` |
`rowProps` | object | `rowProps` prop from `MultiColumnList` component. Can be passed to extend props that are passed to `rowFormatter` | {} |