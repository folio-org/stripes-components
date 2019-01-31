This is a simple button component which receives an `open` prop (boolean) and displays a caret icon accordingly to its value. If you want to use it with a dropdown (you probably will), its `data-role` prop should be set to `toggle`. The `<Dropdown>` component takes care of passing down the `open` prop to the button which has `data-role="toggle"`, so there is no need to do it manually. 
### Example
```
<Dropdown
  open={this.state.isDropdownOpen}
  onToggle={this.onDropdownToggle}
>
  <DropdownButton data-role="toggle">
    Toggle dropdown
  </DropdownButton>
  <DropdownMenu data-role="menu">
    <span>This is our dropdown</span>
  </DropdownMenu>
</Dropdown>
```