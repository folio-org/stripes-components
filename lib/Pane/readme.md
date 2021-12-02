# Pane
Primary staple of layout for FOLIO modules.

## Basic Usage
```js
import { Pane, PaneHeader, Paneset } from '@folio/stripes/components';

<Paneset>
  <Pane
    defaultWidth="20%"
    paneTitle="Filters"
  >
    Pane Content
  </Pane>
  <Pane
    defaultWidth="fill"
    padContent={false} // prevent horizontal scrolling
    noOverflow         // at the pane level (useful in case the rendered content, like a results list, handles this.)
    // Render a custom header using the "renderHeader"-prop if needed
    renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Search Results" />}
  >
    Pane Content
  </Pane>
</Paneset>
```

## Sizing
A Pane requires a `defaultWidth` prop to tell its parent `<Paneset>` how it should be sized. The following example has a first pane with a static width of 20% and a second pane with dynamic width (supplied `"fill"` for its `defaultWidth`) that will occupy the remaining width of the paneset.

```js
import { Pane, PaneHeader, Paneset } from '@folio/stripes/components';

<Paneset>
    <Pane defaultWidth="20%">
      // Pane Content
    </Pane>
    <Pane defaultWidth="fill">
      // Pane Content
    </Pane>
</Paneset>
```

## Dismissible
To make a pane dismissible, simply supply the `dismissible` prop and a module-level handler to the `onClose` prop.

```js
    // set up boolean for rendering the pane...
    this.state = {
        showPane: true,
    };
    // ...
    handleClose() {
      this.setState({showPane: false});
    }
    // in the module's 'render' function...
    {
      this.state.showPane &&
      <Pane
        renderHeader={renderProps => (
          <PaneHeader
            {...renderProps}
            dismissible
            onClose={this.handleClose}
            paneTitle="Dismiss this"
          />
        )}
      >
        // Pane Content...
      </Pane>
    }
```

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
actionMenu | func | Activates the [action menu dropdown](#action-menu). Expects a function that returns a component or node. | undefined |
appIcon | element | Render an app icon in the PaneHeader by passing an `<AppIcon>` from stripes-core. |  | undefined
defaultWidth | string percentage or `"fill"` | Tells the pane the percentage of the paneset that it should occupy. A string percentage (`"25%"`) will render a pane with a width of 25% of its containing element. The string `"fill"` will cause the pane to occupy any remaining space in the paneset after percentage-sized panes are accounted for. |  | &#10004;
centerContent | bool | Wraps the content of the pane in a centered container. This can be useful when rendering forms or preview panes where you don't want the content to take up the entire width of a potentially very wide pane. | |
dismissible | bool or "last"| If true, pane will render a close (&times;) button in its firstMenu. If "last" is supplied, the button will render in the lastMenu. | false |
firstMenu | node | Component (typically an instance of `<PaneMenu>`) to render buttons or icons at the beginning of the header. |  |
footer | node | Render a component at the bottom of the Pane containing a form. |  |
height | string | css-value representation of a custom pane height. The maximum height of a Pane is 100% of the viewport (vh unit) - the height of the universal FOLIO header. A situation where you may need this is if the Pane (or Paneset) is wrapped in an unstyled element without any width/max-width set.  |  |
lastMenu | node | Component (typically an instance of `<PaneMenu>`) to render buttons or icons at the far end of the header. |  |
noOverflow | bool | set to true if the Pane content is not expected to scroll. This can cure issues with flashing scrollbars on search result Panes. | false |
onClose | func | Callback fired when the pane is closed using its dismiss button. |  |
padContent | bool | Adds default padding to the Pane | true |
paneTitle | string or node | Text or text-rendering elements to appear in the pane header. |  |
paneTitleAutoFocus | bool | If this prop is `true`, the pane title will automatically focus when the Pane mounts | |
paneTitleRef | func | function to set a ref to title element - great for managing focus when new panes are shown/updated. | |
renderHeader | func | Render a pane header using the render prop pattern. Pass a function that returns a `<PaneHeader>`. Pass `null` to disable the pane header. Read more in the `<PaneHeader>`-readme. | |
subheader | node | Render a component below the Pane's header. |  | false

## Pane title
The `paneTitle` and `paneSub` props contribute to the title contents of the `<Pane>`. `paneTitle` renders the large text - `paneSub` renders smaller text below it. The two are rendered within an `H2` heading to support the accessiblity hierarchy of the UI. The `appIcon` prop renders the supplied `appIcon` next to the text.

```
<Pane
  defaultWidth="fill"
  paneTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
  paneSub="121 results found"
>
  Some content..
</Pane>
```

## Menus
`<Pane>`s have the 3 menues that can be added in the header - `firstMenu`, `lastMenu`, and `actionMenu`. `firstMenu` is (in ltr languages) the upper left corner of the window. By convention, this is usually a close or dismiss action - something that references the previous `Pane` in a multi-pane layout. `lastMenu` is rendered in the ltr-upper right corner. The prop accepts a `<PaneMenu>` with the necessary children.

### FirstMenu and lastMenu example
```
const firstMenu = (
  <PaneMenu>
    <PaneHeaderIconButton key="icon-search" icon="search" />
  </PaneMenu>
);

const lastMenu = (
  <PaneMenu>
    <PaneHeaderIconButton key="icon-comment" icon="comment" />
    <PaneHeaderIconButton key="icon-edit" icon="edit" />
  </PaneMenu>
);

<Pane
  firstMenu={firstMenu}
  lastMenu={lastMenu}
  defaultWidth="fill"
  paneTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
>
  Some content..
</Pane>

```

## Action menu
The prop accepts a function that returns the rendered contents of the menu. If `lastMenu` is provided, the ouput of this function will be appended to the children of `lastMenu`. If no container is present for last menu, this rendered content will not appear!
```
const actionMenu = ({ onToggle }) => ( // eslint-disable-line
  <Fragment>
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

<Pane
  actionMenu={actionMenu}
  defaultWidth="fill"
  paneTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
>
  Some content..
</Pane>
```
## AppIcons
AppIcon's can be applied to the panetitle in this way. Migration Note: if your app has `deprecation warnings ` for `<AppIcon>`, switch to using the appIcon prop in the following way: 

```js
import { Pane } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

<Pane
    ...
    appIcon={<AppIcon app="inventory" iconKey="holdings" />}
>
    Content here..
</Pane>
```

## Sub-header
Using the `subheader` prop allows you to render content below the pane's header, but outside of the scrollable container of the pane's content. Wrap your content if the `<PaneSubHeader>` component if your content needs some padding to align it with the content of the `<Pane>`.

```
const sbh = (
      <PaneSubheader>
        <SegmentedControl activeId="instanceLevel">
          <Button id="instanceLevel">Instance</Button>
          <Button id="holdingsLevel">Holdings</Button>
          <Button id="itemsLevel">Items</Button>
        </SegmentedControl>
      </PaneSubheader>
    );

...
<Pane id="pane-instancedetails" subheader={sbh} > ...
```
