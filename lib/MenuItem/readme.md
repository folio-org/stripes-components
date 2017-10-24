# MenuItem
Wrapper component for the DropdownMenu children to provide control on menu items to be able to set close status when clicking on the menuItem elements if status is not controlled by state.

Example use case is when using UncontrolledDropdown.

## Basic-Usage
This basic usage is for UncontrolledDropdown sets up a dropdown closed status when selected  any items inside the DropdownMenu

```js
import {UncontrolledDropdown} from '@folio/stripes-components/lib/Dropdown';
import MenuItem from '@folio/stripes-components/lib/MenuItem';

  <UncontrolledDropdown
      id="uniqueid"
      pullRight
      onToggle={this.handleOptionsClick}
      onSelectItem={handleOptionsChange}
    >
      <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true" t>&#46;&#46;&#46;</Button>
      <DropdownMenu
        data-role="menu"
        aria-label="available permissions"
      >
        <button type="button">Example</button>
        <MenuItem itemMeta={{ data, action: 'test' }}>
          <Button type="button" data-action="example" >Example1</Button>
           <button type="button"  >Example2</button>
        </MenuItem>
      </DropdownMenu>
    </UncontrolledDropdown>
```

## Properties

| **Name**        | **Type**           | **Default**  | **Description**
| ------------- |:-------------:| -----:|------------:|
|children | node, array of nodes | |content of the DropdownMenu |
| onClick | function      |   |   callback fired when clicking the element|
| itemMeta | object      |   |   Value passed to the `onClick` handler, useful for identifying the selected menu item.  |
