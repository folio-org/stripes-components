# Dropdown
A toggleable, contextual overlays for displaying lists of links and more.

## Dropdown with Advanced Usage
UI-modules may add styling to the parent div's such as overflow:hidden which may result in cropping the dropdown .So Dropdown component used [react-tether](https://www.npmjs.com/package/react-tether) module which is a wrapper around  [tether](http://tether.io/) library to assist us with such issues ,which renders it's children as a new React subtree within **body** and absolute positions element so they stay next to another element. 

## Basic-Usage

```
 <Dropdown 
  id="AddPermissionDropdown" 
  dropdown
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
        {permissionsDD}
      </DropdownMenu>
  </Dropdown>
```

## Advanced-Usage

To use the tether and have the [Default Props for tether](#DefaultProps-tether) set, all we need to do is **remove the dropdown prop** this will let component know you want to use the tether with default settings

```
  <Dropdown
    id="AddPermissionDropdown"
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

In case, ui-modules want to have some control on positioning, target element  or would like to use other options that are available with [tether](http://tether.io/#options) .This will be a very good example

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

## Properties

| **Name**        | **Type**           | **Default**  | **Description**
| ------------- |:-------------:| -----:|------------:|
| open      | bool | false |  current state for items like dropdown, popover, tooltip   |
| id      | one of: "string" ,"number"      |   |   An html id attribute, necessary for assistive technologies, such as screen readers. |
| onToggle | function      |   |   callback for toggling open in the controlling component    |
| group      | bool | false |          |
| dropdown      | bool | false |    For basic setup of dropdown|
| tag      | string      |  div |   customize component output by passing in an element name or Component                   |
| tether | object      |   |     For absolute postioning see the advanced example                                   |
| disabled | bool      |   |                                        |
| pullRight | bool      |   |                                        |

## Default Props for tether

| **Name**        | **Type**           | **Default**  | **Description**
| ------------- |:-------------:| -----:|------------:|
| attachment      | string | top center |  Positioning of the dropdown|
| renderElementTo      | string     | document.body  |    Tells it where in the DOM tree to actually render the element |
| constraints     | object   | [{ to: 'scrollParent',pin: true,}]|


### Upgrading from Dropdown.

Replace imports and make sure update following props
* Update roles attribute bsRole => data-role
* Need to add either dropdown bool or tether object props based on the requirement .Please look for examples above 

1) Change 
```
import {Dropdown} from 'react-bootstrap';
```
To
```
import Dropdown from '@folio/stripes-components/lib/Dropdown';

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

3) Add new prop to Dropdown either the **dropdown** or **tether** prop .If none provided component defaults to tether with basic tether props.
