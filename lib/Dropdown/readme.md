# Dropdown
A toggleable, contextual overlay for displaying lists of links and more.

## Dropdown with Custom Tether Options
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

## Slightly more advanced usage

In the example above, `<Dropdown>` renders its trigger internally as a `<Button>`, passing all the appropriate handlers. If more custom control is necessary, it provides a `renderTrigger` prop - a function to render the button that's provided all of the handlers and even `aria-` attributes. 

```
  const trigger = (triggerRef, toggleMenu, ariaProps, keyHandler) => (
    <Button autoFocus ref={triggerRef} onClick={toggleMenu} onKeyDown={keyHandler} {...ariaProps}>
      Trigger
    </Button>
  );

  <Dropdown
    id="AddPermissionDropdown"
    renderTrigger={this.trigger}
    >
      <DropdownMenu
        data-role="menu"
        aria-label="available permissions"
        onToggle={this.onToggleAddPermDD}
       >
        {permissionsDD}
      </DropdownMenu>
  </Dropdown>
```                                   
### Migration from past versions.
- Previously, `<Dropdown>` accepted a `tether` prop that allowed for finer control over the `react-tether` library. Popper.js has its own API for adjusting the positioning behavior.
- Previously, the API for dropdown used `data-role` attributes on children to identify which element to use as the trigger for the dropdown and which to use as a menu. This worked, but it wasn't great practice to inspect the children and augment their props. Previous `data-role="toggle"` components can be moved out to a `renderTrigger` function, or possibly omitted if the `label` and `buttonProps` props are adequate.
