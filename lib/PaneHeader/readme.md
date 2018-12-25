# PaneHeader
A default [`<Pane />`](/?selectedKind=Pane) builds a simple header that includes centered title text (supplied in the `paneTitle` prop) with customizable menus at either end (`firstMenu`, `lastMenu` props). When the page is rendered in a right-to-left language, the menus will automatically switch placement.

## Basic Usage
Pass PaneHeader props directly to the [`<Pane />`](/?selectedKind=Pane).

```js
import { Pane } from '@folio/stripes/components';

<Pane
    paneTitle="Pane header title"
    paneSub="Pane header sub"
    firstMenu={...}
    lastMenu={...}
    actionMenu={...}
    appIcon={{
        app: 'inventory',
        key: 'holdings',
    }}
>
    Content here..
</Pane>
```

## App icon
Render an [`<AppIcon />`](/?selectedKind=AppIcon) in the pane header by passing an object to the `appIcon`-prop. The object should contain a key of `app` that matches a FOLIO app – e.g. "users" or "inventory". Pass an optional `key` to render a specific icon (the default app icon will be rendered if none is provided). See [`<AppIcon />`](/?selectedKind=AppIcon) for more information.

```js
<Pane appIcon={{
    app: 'inventory',
    key: 'holdings',
}}>
    // Pane Content
</Pane>
```

## Custom pane header
Need to render a custom pane header? No problem. The `header` prop will accept a component to render instead of the default pane header.

```js
const searchHeader = <FilterPaneSearch id="SearchField" {...otherProps} />;

<Pane header={searchHeader}>
    // Pane Content
</Pane>
```

## Action menu
Activate the pane action menu by passing a function to the `actionMenu`-prop that returns a component.

The necessary props for closing the dropdown (onToggle) will be passed into the function.

```js
import { Button, Icon, Checkbox, RadioButton, MenuSection } from '@folio/stripes/components';

// A simple action menu
const getActionMenu = ({ onToggle }) => (
    <Fragment>
        <Button buttonStyle="dropdownItem">
            <Icon icon="duplicate">
                Duplicate
            </Icon>
        </Button>
        <Button buttonStyle="dropdownItem">
            <Icon icon="edit">
                Edit
            </Icon>
        </Button>
        <Button buttonStyle="dropdownItem">
            <Icon icon="bookmark">
                Bookmark
            </Icon>
        </Button>
    </Fragment>
);

// A more complex action menu
const actionMenu = ({ onToggle }) => (
  <Fragment>
    <MenuSection label="Layout">
      <RadioButton name="layout" label="Automatic layout" />
      <RadioButton name="layout" label="Always use table layout" />
      <RadioButton name="layout" label="Always use cards layout" />
    </MenuSection>
    <MenuSection label="Columns">
      <Checkbox label="ID" />
      <Checkbox label="Name" />
      <Checkbox label="Email" />
      <Checkbox label="Phone" />
    </MenuSection>
    <MenuSection label="Actions">
      <Button buttonStyle="dropdownItem" onClick={onToggle}>
        <Icon size="small" icon="eye-open">
          View
        </Icon>
      </Button>
      <Button buttonStyle="dropdownItem" onClick={onToggle}>
        <Icon size="small" icon="edit">
          Edit
        </Icon>
      </Button>
      <Button buttonStyle="dropdownItem" onClick={onToggle}>
        <Icon size="small" icon="duplicate">
          Duplicate
        </Icon>
      </Button>
    </MenuSection>
  </Fragment>
);

<Pane paneTitle="My title" actionMenu={getActionMenu}>
    // Pane Content
</Pane>
```