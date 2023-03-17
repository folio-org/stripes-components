# Dropdown
A toggleable, contextual overlay for displaying lists of links and more.

## Uses Popper
Dropdown makes use of [popper.js](https://popper.js.org/) to render its menu to the OverlayContainer div rendered by `stripes-core`. This overcomes issues with Dropdowns that might be cut off by containers with `overflow: hidden` in their styling.

## Dropdown works in both controlled and uncontrolled scenarios.
If you're passing in an `open` prop, you should also pass an `onToggle` prop to handle the exterior state change. Additional focus management will be handled internally by the component. If neither props are passed, `<Dropdown>` will happily manage its own toggle state.

## Basic-Usage
This basic version sets up a dropdown with it's open/closed status controlled by state. Note that the `onToggle` handler is passed to both the `<Dropdown>` component and the `<DropdownMenu>` component. `<DropdownMenu>` sets up listeners so that the `onToggle` function will be called if the user clicks anywhere outside of the menu in the DOM.

```
import { Dropdown } from '@folio/stripes/components';

//...

 <Dropdown
  id="AddPermissionDropdown"
  label="Dropdown Example"
  buttonProps={{ buttonStyle: 'primary' }}
  >
      <DropdownMenu
        aria-label="available permissions"
      >
        <ul>
          <li><a href="#">Example Link 1</a></li>
          <li><a href="#">Example Link 2</a></li>
        </ul>
      </DropdownMenu>
  </Dropdown>
```

## `renderTrigger` and `renderMenu` props.

In the example above, `<Dropdown>` renders its trigger internally as a `<Button>`, passing all the appropriate handlers. The menu was simply handled by the children. If more custom control is necessary, it provides both a `renderTrigger` and `renderMenu` props for render functions. These provide statuses, handlers and even `aria-` attributes

```
  const trigger = ({ triggerRef, toggleMenu, ariaProps, keyHandler }) => (
    <Button autoFocus ref={triggerRef} onClick={toggleMenu} onKeyDown={keyHandler} {...ariaProps}>
      Trigger
    </Button>
  );

  const menu = ({open, onToggle, keyHandler}) => {
    <DropdownMenu
      role="menu"
      aria-label="available permissions"
      onToggle={this.onToggleAddPermDD}
    >
      <Button buttonStyle="menuItem" role="menuitem" onClick={ () => {this.selectMethod(onToggle)}}>Select All</Button>
    </DropdownMenu>
  }

  <Dropdown
    id="AddPermissionDropdown"
    renderTrigger={this.trigger}
    renderMenu={this.menu}
  />
```

## Keep A11y in mind!
The above examples illustrate two different use-cases for dropdowns... the first (containing ul/li's/links) is a navigational dropdown - it would be used as **part of a top-level navigation** or **rendered within a nav element**. Under these circumstances, menu aria is unneccessary as it can present some redundancy for assistive technology users. The second example (containing a button) is an application menu, containing functional actions - it's not part of some table-of-contents or structural organization, as the first example would be. The `role="menu"` and `role="menuitem"` attributes **are necessary here**. They'll announce important information over a screen reader to let them know when they've entered/exited the menu.

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`label` | node | label for button | | false
`id` | string | id for trigger. | | false
`disabled` | bool | if true, dropdown will not open. | false | false
`renderTrigger` | func | see [renderTrigger] section for a description of this function used to render custom triggers. | |
`renderMenu` | func | see [renderTrigger] section for a description of this function used to render menus. | |
`buttonProps` | object | If you're not using `renderTrigger`, this is an object of props that are spread onto the default `<DropdownButton>` | |
`open` | bool | required for controlled usage only. A boolean to tell `<Dropdown>` to display its menu or not. | | controlled-only
`onToggle` | func | callback for updating the open/closed state for controlled use. | | controlled-only
`usePortal` | bool | whether or not the internal `Popper` component should render the menu to the `#OverlayContainer` or not. | true |
`placement` | string |  See available options in the <a href="https://github.com/folio-org/stripes-components/tree/master/lib/Popper" target="_blank">Popper documentation</a>. | `bottom` |
`modifiers` | object | `Popper.js` uses a collection of modifiers which ultimately define the location of the menu element. This prop can be used to make small adjustments to positioning or affect behavior in overflow situations (`flip` modifier). For more details, please, go to https://popper.js.org/popper-documentation.html#modifiers. | `{flip: { boundariesElement: 'scrollParent', padding: 10 }, preventOverflow: { boundariesElement: 'scrollParent', padding: 10 }}` |
`relativePosition` | bool | in [some cases](https://stackoverflow.com/questions/54984952/popper-js-and-flex-end-causing-body-overflow), Popper.js requires relative positioning on the parent element of the anchor to adequately prevent overflow |

### Migration from past versions.
- Previously, the API for dropdown used `data-role` attributes on children to identify which element to use as the trigger for the dropdown and which to use as a menu. This worked, but it wasn't great practice to inspect the children and augment their props. Previous `data-role="toggle"` components can be moved out to a `renderTrigger` function, or possibly omitted if the `label` and `buttonProps` props are adequate. The `data-role="menu"` element can be rendered using the `renderMenu` prop.
