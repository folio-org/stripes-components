# Dropdown
A toggleable, contextual overlays for displaying lists of links and more.

## Dropdown with Custom Tether Options
UI-modules may add styling to the parent div's such as overflow:hidden which may result in cropping the dropdown .So Dropdown component used [react-tether][] module which is a wrapper around  [tether][] library to assist us with such issues ,which renders it's children as a new React subtree within **body** and absolute positions element so they stay next to another element. 

## Basic-Usage

```
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
        {permissionsDD}
      </DropdownMenu>
  </Dropdown>
```

## Advanced-Usage

In case, ui-modules want to have some control on positioning, target element  or would like to use other options that are available with [tether][] .This will be a very good example

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

If any of the modules does not want to control the dropdown i.e if the module doesn't set the state for the dropdown open and close it can use the below example  

```
import {UncontrolledDropdown} from '@folio/stripes-components/lib/Dropdown';

  <UncontrolledDropdown
      id="uniqueid"
      pullRight
      onSelect={handleOptionsChange}
      onToggle={this.handleOptionsClick}
    >
      <Button align="end" bottomMargin0 data-role="toggle" aria-haspopup="true" t>&#46;&#46;&#46;</Button>
      <DropdownMenu
        data-role="menu"
        aria-label="available permissions"
      > <Button type="button" data-action="renew" >Renew</Button></DropdownMenu>
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
| onSelect | function      |   |   callback for selecting item from menu in the uncontrolling component    |

## Default Props for tether

| **Name**        | **Type**           | **Default**  | **Description**
| ------------- |:-------------:| -----:|------------:|
| attachment      | string | top center |  Positioning of the dropdown. A string of the form 'vert-attachment horiz-attachment'vert-attachment can be any of 'top', 'middle', 'bottom' horiz-attachment can be any of 'left', 'center', 'right'|
| targetAttachment      | string | bottom center |  Positioning of the dropdown. A string similar to attachment. The one difference is that, if it's not provided, targetAttachment will assume the mirror image of attachment.|
| renderElementTo      | string     | document.body  |    Tells it where in the DOM tree to actually render the element |
| constraints     | object   |  [{to: 'window',attachment: 'together',},{to: 'scrollParent',pin: true,},],|


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

[react-tether]: https://www.npmjs.com/package/react-tether
[tether]: http://tether.io/
[tether]: http://tether.io/#options
