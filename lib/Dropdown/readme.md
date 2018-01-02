# Dropdown
A toggleable, contextual overlay for displaying lists of links and more.

## Dropdown with Custom Tether Options
Dropdown makes use of [react-tether](https://github.com/souporserious/react-tether) to render its menu to the **body** of the page by default. This overcomes issues with Dropdowns that might be cut off by containers with `overflow: hidden` in their styling. If any scrolling occurs, tether will also keep the menu element in the correct position relative to its corresponding `data-role="toggle"` component.

## Basic-Usage
This basic version sets up a dropdown with it's open/closed status controlled by state. Note that the `onToggle` handler is passed to both the `<Dropdown>` component and the `<DropdownMenu>` component. `<DropdownMenu>` sets up listeners so that the `onToggle` function will be called if the user clicks anywhere outside of the menu in the DOM.

```
import { Dropdown } from '@folio/stripes-components/lib/Dropdown';

//...

 <Dropdown
  id="AddPermissionDropdown"
  open={this.state.open}
  onToggle={this.onToggleAddPermDD}
  group
  style={{ float: 'right' }}
  pullRight
  >
      <Button
        data-role="toggle"
        align="end"
        bottomMargin0
        aria-haspopup="true"
      >
        &#43; Add Permission
      </Button>
      <DropdownMenu
        data-role="menu"
        aria-label="available permissions"
        onToggle={this.onToggleAddPermDD}
      >
        <ul>
          <li><a href="#">Example Link 1</a></li>
          <li><a href="#">Example Link 2</a></li>
        </ul>
      </DropdownMenu>
  </Dropdown>
```

## Advanced-Usage

In case ui-modules want to have some control on positioning, target element, or would like to use other options that are available with [tether][]. This will be a very good example:

```
 const tether = {
       attachment:"top right",
       classPrefix:"permissions",
     }
  <Dropdown
    id="AddPermissionDropdown"
    tether={tether}
    open={this.state.open}
    onToggle={this.onToggleAddPermDD}
    style={{ float: 'right' }}
    pullRight
    >
      <Button
       data-role="toggle"
       align="end"
       bottomMargin0
       aria-haspopup="true"
      >
        &#43; Add Permission
      </Button>
      <DropdownMenu
        data-role="menu"
        aria-label="available permissions"
        onToggle={this.onToggleAddPermDD}
       >
        {permissionsDD}
      </DropdownMenu>
  </Dropdown>
```

## UncontrolledDropdown-Usage

If the module is unable to keep track of the `<Dropdown>`'s open/closed status within its state (such as dropdowns used in repeated table rows), using the 'Uncontrolled' version is best.

Note :Adding `<MenuItem itemMeta={{metaData:'data' }}>` for the children in the `<DropdownMenu>` will have an ability to close the dropdown on clicking the menuItems element and be able to pass in any meta data specific to the items.

```
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
        <MenuItem itemMeta={{metaData:'data' }}>
          <Button type="button" data-action="renew" >Renew</Button>
        </MenuItem>
      </DropdownMenu>
    </UncontrolledDropdown>
```
## Properties

| **Name**        | **Type**           | **Default**  | **Description**
| ------------- |:-------------:| -----:|------------:|
| open      | bool | false |  current state for items like dropdown, popover, tooltip   |
| id      | one of: "string" ,"number"      |   |   An html id attribute, necessary for assistive technologies, such as screen readers. |
| onToggle | function      |   |   callback for toggling open in the controlling component    |
| group      | bool | false |          |
| tag      | string      |  div |   customize component output by passing in an element name or Component                   |
| tether | object      |   |     For absolute postioning see the advanced example                                   |
| disabled | bool      |   |                                        |
| pullRight | bool      |   |                                        |
| onSelectItem | function      |   |   callback for selecting item from menu in the uncontrolling component    |

## Default Props for tether

| **Name**        | **Type**           | **Default**  | **Description**
| ------------- |:-------------:| -----:|------------:|
| attachment      | string | top center |  Positioning of the dropdown. A string of the form 'vert-attachment horiz-attachment'. The vert-attachment can be any of 'top', 'middle', 'bottom'. The horiz-attachment can be any of 'left', 'center', 'right'|
| targetAttachment      | string | bottom center |  Positioning of the dropdown. A string similar to attachment. The one difference is that, if it's not provided, targetAttachment will assume the mirror image of attachment.|
| renderElementTo      | string     | document.body  |    Tells it where in the DOM tree to actually render the element |
| constraints     | object   |  [{to: 'window',attachment: 'together',},{to: 'scrollParent',pin: true,},],|


### Upgrading from Dropdown

Replace imports and make sure to update following props
* Update roles attribute bsRole => data-role
* Need to add either dropdown bool or tether object props based on the requirement. Please look for examples above .

1) Change
```
import {Dropdown} from 'react-bootstrap';
```
To
```
import {Dropdown} from '@folio/stripes-components/lib/Dropdown';

```

2) Change bsRole on the children
```
<Button
    align="end"
    bottomMargin0
    bsRole="toggle"
    aria-haspopup="true"
  >
    &#43; Add Permission
</Button>
<DropdownMenu
    bsRole="menu"
    width="40em"
    aria-label="available permissions"
    onToggle={this.onToggleAddPermDD}
  >
  {permissionsDD}
</DropdownMenu>

```
To
```
 <Button
    align="end"
    bottomMargin0
    data-role="toggle"
    aria-haspopup="true"
  >
    &#43; Add Permission
</Button>
<DropdownMenu
    data-role="menu"
    width="40em"
    aria-label="available permissions"
    onToggle={this.onToggleAddPermDD}
  >
  {permissionsDD}
</DropdownMenu>
```
3) In the case of `onSelect` prop is now `onSelectItem`

[react-tether]: https://www.npmjs.com/package/react-tether
[tether]: http://tether.io/
[tether]: http://tether.io/#options
