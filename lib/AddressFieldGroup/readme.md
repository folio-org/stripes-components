# Address Field Group
### Usage

import
```js
import AddressList from '@folio/stripes-components/lib/AddressFieldGroup/AddressList';
```

set some data...
```js
    const addressArray = [
      {
        id:'0',
        country: 'USA', addressLine1: 'Burch Street', addressLine2: 'Martin Lovell', primary: true, city: 'Jemisonville', stateRegion: 'North Dakota', zipCode: '78392'
      },
      {
        id:'1',
        country: 'USA', addressLine1: 'Burt Street', addressLine2: '', primary: false, city: 'Jemisonville', stateRegion: 'North Dakota', zipCode: '78392'
      }
    ];
```
Think about handlers for Create, Update, Delete actions...
```js
 handleAddressCreate(values) {
    console.log(values);
  }

  handleAddressUpdate(values) {
    console.log(values);
  }

  handleAddressDelete(id) {
    console.log(id);
  }
```

Use the `AddressList` component in your jsx...
```js
<AddressList addresses={addressArray} onCreate={this.handleAddressCreate} onUpdate={this.handleAddressUpdate} onDelete={this.handleAddressDelete} canEdit canDelete/>
```

### Configuration (props)
Name | description | default | required
--- | --- | --- | ---
canEdit | Address Editing Privilege/Switch.... |
canDelete | Address Deletion Privilege/Switch....
onCreate | callback for new address record creation... should accept address object... | |yes
onUpdate | callback for saving record... should accept address object... | | yes
onDelete | callback for deleting record... should accept id or unique identifier... | | yes
addresses | Array of address objects with properties such as id, country, addressLine1, addressLine2, city, stateRegion, zipCode.... | | yes
uniqueField | in case the unique identifier is something besides 'id' | `'id'`
sectionLabel | Displays a custom 'h2' html tag at top of listing. | `'Address'`
showAll | boolean for default to show all addresses or only show primary (defaults to false(primary Only));  Toggleable by the 'show more addresses (#)' button below the list...(appears if more than 1 address is stored) | `false` |
labelMap | object to match field names with custom labels for UI rendering. | `{addressLine1: 'Address Line 1', addressLine2: 'Address Line 2', stateRegion: 'State/Province/Region', zipCode: 'Zip/Postal Code'}`
visibleFields | fields from Address objects to render to the body of the display/form. Also specifies the order of fields. Header field is not included | `[ 'country', 'addressLine1', 'addressLine2', 'city', 'stateRegion', 'zipCode' ]`
headerFormatter | object with `view` and `edit` properties that contain functions to determine how the header of each address renders in their respective modes. The functions are in the form of ``(addressObject) => addressObject[addressProperty]`` - so it's possible to render a user-provided name or some other field of address info. For the `edit` property, it may be necessary to return some sort of editable component | ``{ view: (address) => address.primaryAddress ? "Primary" : "Alternate", edit: (address) => <Field label="Primary Address" name="primaryAddress" checked={address.primaryAddress} labelStyle="labelSize1" id={`PrimaryAddress---${address.id}} component={Checkbox}/>``
fieldComponents | maps field names to rendered components for edit mode, e.g. ``{ city:Select }`` will render a select dropdown for the city field. The components are passed through the redux-form Field component. In cases when extra props need to be passed to the component the format: ``{ city: { component: Select, props: cityData } }`` is also supported | `{ country: TextField, addressLine1: TextField, addressLine2: TextField, city: TextField, stateRegion: TextField, zipCode: TextField, }`

### Additional Info
AddressList makes use of AddressEdit and AddressView components, used for editing and viewing addresses, respectively.  These two components may also be used on their own.
