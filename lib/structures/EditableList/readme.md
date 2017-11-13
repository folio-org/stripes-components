# Editable List
A component used for creating editable CRUD lists.

### Usage

import
```js
import EditableList from '@folio/stripes-components/lib/structures/EditableList';
```

set some data...
```js
    const data = [
      {
        id: 1,
        name: 'Item 1'
      },
      {
        id: 2,
        name: 'Item 2'
      }
    ];
```


Use the `EditableList` component in your jsx
```js
<EditableList contentData={data} createButtonLabel="+ Add new" visibleFields=visibleFields={['addressType', 'desc']} itemTemplate={{ id: number, name: 'string' }} onUpdate={this.handleUpdate} onDelete={this.handleDelete} onCreate={this.handleCreate} />
```

### Configuration (props)
Name | description | default | required
--- | --- | --- | ---
contentData | Array of objects to be rendered as list items.
nameKey | The key that uniquely names listed objects: defaults to 'name'. | no
onCreate | Callback for creating new list items. | no
onUpdate | callback for saving record.  | no
onDelete | Callback for saving editted list items. | no
label | The text for the H3 tag in the header of the component | no
createButtonLabel | Label for the 'Add' button | no



sectionLabel | Displays a custom 'h2' html tag at top of listing. | `'Address'`
showAll | boolean for default to show all addresses or only show primary (defaults to false(primary Only));  Toggleable by the 'show more addresses (#)' button below the list...(appears if more than 1 address is stored) | `false` |
labelMap | object to match field names with custom labels for UI rendering. | `{addressLine1: 'Address Line 1', addressLine2: 'Address Line 2', stateRegion: 'State/Province/Region', zipCode: 'Zip/Postal Code'}`
visibleFields | fields from Address objects to render to the body of the display/form. Also specifies the order of fields. Header field is not included | `[ 'country', 'addressLine1', 'addressLine2', 'city', 'stateRegion', 'zipCode' ]`
headerFormatter | object with `view` and `edit` properties that contain functions to determine how the header of each address renders in their respective modes. The functions are in the form of ``(addressObject) => addressObject[addressProperty]`` - so it's possible to render a user-provided name or some other field of address info. For the `edit` property, it may be necessary to return some sort of editable component | ``{ view: (address) => address.primaryAddress ? "Primary" : "Alternate", edit: (address) => <Field label="Primary Address" name="primaryAddress" checked={address.primaryAddress} labelStyle="labelSize1" id={`PrimaryAddress---${address.id}} component={Checkbox}/>``
fieldComponents | maps field names to rendered components for edit mode, e.g. ``{ city:Select }`` will render a select dropdown for the city field. The components are passed through the redux-form Field component. In cases when extra props need to be passed to the component the format: ``{ city: { component: Select, props: cityData } }`` is also supported | `{ country: TextField, addressLine1: TextField, addressLine2: TextField, city: TextField, stateRegion: TextField, zipCode: TextField, }`

### Additional Info
AddressList makes use of AddressEdit and AddressView components, used for editing and viewing addresses, respectively.  These two components may also be used on their own.
