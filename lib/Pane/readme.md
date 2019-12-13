# Pane
Primary staple of layout for FOLIO modules.

## Basic Usage
```js
import { Pane, PaneHeader, Paneset } from '@folio/stripes/components';

<Paneset>
  <Pane
    defaultWidth="20%"
    renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Filters" />}
  >
    // Pane Content
  </Pane>
  <Pane
    defaultWidth="fill"
    renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle="Search Results" />}
  >
    // Pane Content
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
defaultWidth | string percentage or `"fill"` | Tells the pane the percentage of the paneset that it should occupy. A string percentage (`"25%"`) will render a pane with a width of 25% of its containing element. The string `"fill"` will cause the pane to occupy any remaining space in the paneset after percentage-sized panes are accounted for. |  | &#10004;
footer | node | Render a component at the bottom of the Pane containing a form. |  |
height | string | css-value representation of a custom pane height. The maximum height of a Pane is 100% of the viewport (vh unit) - the height of the universal FOLIO header. A situation where you may need this is if the Pane (or Paneset) is wrapped in an unstyled element without any width/max-width set.  |  |
noOverflow | bool | set to true if the Pane content is not expected to scroll. This can cure issues with flashing scrollbars on search result Panes. | false |
padContent | bool | Adds default padding to the Pane | true |
renderHeader | func | Render a pane header using the render prop pattern. Pass a function that returns a `<PaneHeader>`. Pass `null` to disable the pane header. Read more in the `<PaneHeader>`-readme. | |
subheader | node | Render a component below the Pane's header. |  | false

## Legacy props
The props below are passed directly down to the `<PaneHeader>` via. the `<Pane>`-component. This will be deprecated in the future.

The recommended approach is to pass a `renderHeader`-prop to the `<Pane>` that returns a `<PaneHeader>`. Read more in the documentation for `<PaneHeader>`.

Name | type | description | default | required
--- | --- | --- | --- | ---
actionMenu | func | Activates the action menu dropdown. Expects a function that returns a component or node. | undefined |
appIcon | element | Render an app icon in the PaneHeader by passing an `<AppIcon>` from stripes-core. |  | undefined
dismissible | bool or "last"| If true, pane will render a close (&times;) button in its firstMenu. If "last" is supplied, the button will render in the lastMenu. | false |
firstMenu | node | Component (typically an instance of `<PaneMenu>`) to render buttons or icons at the beginning of the header. |  |
lastMenu | node | Component (typically an instance of `<PaneMenu>`) to render buttons or icons at the far end of the header. |  |
onClose | func | Callback fired when the pane is closed using its dismiss button. |  |
paneTitle | string or node | Text or text-rendering elements to appear in the pane header. |  |
paneTitleAutoFocus | bool | If this prop is `true`, the pane title will automatically focus when the Pane mounts | |
paneTitleRef | func | function to set a ref to title element - great for managing focus when new panes are shown/updated. | |
