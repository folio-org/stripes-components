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
<EditableList contentData={data} createButtonLabel="+ Add new" visibleFields={['name']} itemTemplate={{ id: 'number', name: 'string' }} onUpdate={this.handleUpdate} onDelete={this.handleDelete} onCreate={this.handleCreate} />
```

### Configuration (props)
Name | description | default | required
--- | --- | --- | ---
contentData | Array of objects to be rendered as list items. | | yes
nameKey | The key that uniquely names listed objects: defaults to 'name'. | | no
onCreate | Callback for creating new list items. | | no
onUpdate | callback for saving record.  | | no
onDelete | Callback for saving editted list items. | | no
label | The text for the H3 tag in the header of the component | | no
createButtonLabel | Label for the 'Add' button | `+ Add new` | no
visibleFields | Array of fields to render. These will also be editable. | | yes
itemTemplate | Object that reflects the shape of list item objects. Values should be strings indicating the type: `{name: 'string'}` | | yes
uniqueField | Fieldname that includes the unique identifier for the list. | `id` | yes
actionSuppression | Object containing properties of list action names: `delete`, `edit` and values of sentinel functions that return booleans based on object properties. | `{ delete: () => false, edit: () => false }` | no
isEmptyMessage | Message to display for an empty list. | | no

