# Editable List
A component used for creating editable CRUD lists.

### Usage

import
```js
import EditableList from '@folio/stripes-components/lib/structures/EditableList';
```

set some data...
```js
    const contentData = [
      {
        id: 1,
        name: 'Item 1',
      },
      {
        id: 2,
        name: 'Item 2',
      }
    ];
```


Use the `EditableList` component in your jsx
```js
<EditableList contentData={contentData} createButtonLabel="+ Add new" visibleFields={['name']} onUpdate={this.handleUpdate} onDelete={this.handleDelete} onCreate={this.handleCreate} />
```

### Configuration (props)
Name | type | description | default | required
--- | --- | --- | --- | ---
contentData | array of objects | Array of objects to be rendered as list items. | | yes
nameKey | string | The key that uniquely names listed objects: defaults to 'name'. | | no
onCreate | function | Callback for creating new list items. | | no
onUpdate | function | Callback for saving record.  | | no
onDelete | function | Callback for saving edited list items. | | no
label | string | The text for the H3 tag in the header of the component | | no
createButtonLabel | string | Label for the 'Add' button | `+ Add new` | no
visibleFields | array of strings | Array of fields to render. These will also be editable. | | yes
itemTemplate | object | Object that reflects the shape of list item objects. Values should be strings indicating the type: `{name: 'string'}` | {} | no
uniqueField | string | Fieldname that includes the unique identifier for the list. | `id` | yes
actionSuppression | object | Object containing properties of list action names: `delete`, `edit` and values of sentinel functions that return booleans based on object properties. | `{ delete: () => false, edit: () => false }` | no
isEmptyMessage | string | Message to display for an empty list. | | no
readOnlyFields | array of strings | Array of non-editable columns - good for displaying meta information within the row. | | no
formatter | object | Allows custom content/components to be displayed in the grid. see example below. | | no
columnMapping | object | Allows custom column names to be applied in case they differ from the properties of `contentData`'s objects| | no
columnWidths | object | Allows custom column widths to be set. If you use this, be sure to set a width for an 'actions' column as part of this object. | | no
id | string | Used as a basic suffix for `id` attributes throughout the component. | | 

### Using formatters for custom data
Sometimes the data alone just won't serve what you need and it needs to be formatted in some certain way. The `formatter` prop allows for custom rendering of data. Each key of the `formatter` object should correspond with a field from `visibleFields` that you'd like to render custom content for. The function will be passed the data object for the particular item of the list, so multiple data points can be used to affect the display.
In this example, the lastUpdated column will be made to display a custom component `<RenderLastUpdated>`, but the function could also simply return a string.
There's no actual `lastUpdated` property within the contentData array's objects - formatters can be used to add completely custom columns.
```
//basic array for contentData
const contentData = [
  { group: "group0", desc: "desc0" }
  { group: "group1", desc: "desc1" }
  { group: "group2", desc: "desc2" }
]

// set up formatter
    const formatter = {
      lastUpdated: item => (<RenderLastUpdated                  // this component uses other data in the objects to match the user info with the date
        lastUpdated={item.lastUpdatedDate}
        user={item.lastEditingUser}
      />
      ),
    };

// later in JSX...
    <EditableList
      contentData={this.props.resources.groups.records || []}
      visibleFields={['group', 'desc', 'lastUpdated',]}
      columnMapping={{ desc: 'Description', lastUpdated: 'Last Updated', }}   // set column headers text
      readOnlyFields={['lastUpdated']}                                        // set formatter-controlled field as read-only
      {...otherProps}
      formatter={formatter}
    />
```
