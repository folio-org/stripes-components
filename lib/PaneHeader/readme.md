# PaneHeader
A default `<Pane>` builds a simple header that includes centered title text (supplied in the `paneTitle` prop) with customizable menus at either end (`firstMenu`, `lastMenu` props). When the page is rendered in a right-to-left language, the menus will automatically switch placement.

Add an `<AppIcon />`-component to the pane header by providing an `appIcon`-prop that matches the key of an installed FOLIO app. Providing the `appIconKey`-prop will display a specific icon that is bundled with the app with they key of `appIcon` (optional). See example below.

## Custom Header
If the header needs functionality, the `header` prop will accept a component to render instead of the default pane header.
```js
const searchHeader = <FilterPaneSearch id="SearchField" {...otherProps} />;
<Pane defaultWidth="20%" header={searchHeader}>
    // Pane Content
</Pane>
```

## Action menu
Activate the pane action menu by passing a function to the `actionMenu`-prop that returns a component.

The necessary props for closing the dropdown (onToggle) etc. will be passed into the function.

```js

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

<Pane defaultWidth="20%" paneTitle="My title" actionMenu={getActionMenu}>
    // Pane Content
</Pane>
```