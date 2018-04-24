# Pane

Primary staple of layout for FOLIO modules.

### Sizing
A Pane requires a `defaultWidth` prop to tell its parent `<Paneset>` how it should be sized. The following example has a first pane with a static width of 20% and a second pane with dynamic width (supplied `"fill"` for its `defaultWidth`) that will occupy the remaining width of the paneset.
```js
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';

<Paneset>
    <Pane defaultWidth="20%" paneTitle="Filters">
        // Pane Content
    </Pane>
    <Pane defaultWidth="fill" paneTitle="Search Results">
        // Pane Content
    </Pane>
</Paneset>
```


#### Dismissible
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
        <Pane paneTitle="Dismiss this" dismissible onClose={this.handleClose}>
            // Pane Content...
        </Pane>
    }
```
### Pane Header
A default `<Pane>` builds a simple header that includes centered title text (supplied in the `paneTitle` prop) with customizable menus at either end (`firstMenu`, `lastMenu` props). When the page is rendered in a right-to-left language, the menus will automatically switch placement.

Add an `<AppIcon />`-component to the pane header by providing an `appIcon`-prop that matches the key of an installed FOLIO app. Providing the `appIconKey`-prop will display a specific icon that is bundled with the app with they key of `appIcon` (optional). See example below.
```js
const paneStartMenu = <PaneMenu><button><Icon icon="bookmark" /></button></PaneMenu>
<Pane defaultWidth="50%" paneTitle="Example First Menu" firstMenu={paneStartMenu} appIcon="instances" appIconKey="items">
    // Pane Content...
</Pane>
```
### Custom Header
If the header needs functionality, the `header` prop will accept a component to render instead of the default pane header.
```js
const searchHeader = <FilterPaneSearch id="SearchField" {...otherProps} />;
<Pane defaultWidth="20%" header={searchHeader}>
    // Pane Content
</Pane>
```

### Pane Action Menu
Activate the Pane Action Menu by supplying an array of objects to the `actionMenuItems` prop.
```js
const actionMenuItems = [
  {
    label: 'Edit',
    onClick: () => { console.log('Clicked!') }, // Using "onClick" will render a <button>
    id="some-id" // Other keys such as id, className, title etc. will be spread on each action menu item
  },
  {
    label: 'Jump to section',
    href: '#section-id', // Using "href" will render a <a>
  },
  {
    label: 'Go to user',
    to: '/user/xxx', // Using "to" will render the react-router's <Link>
  },
];

<Pane defaultWidth="20%" paneTitle="My title" actionMenuItems={actionMenuItems}>
    // Pane Content
</Pane>
```


### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
defaultWidth | string percentage or `"fill"` | Tells the pane the percentage of the paneset that it should occupy. A string percentage (`"25%"`) will render a pane with a width of 25% of its containing element. The string `"fill"` will cause the pane to occupy any remaining space in the paneset after percentage-sized panes are accounted for. |  | &#10004;
height | string | css-value representation of a custom pane height. The maximum height of a Pane is 100% of the viewport (vh unit) - the height of the universal FOLIO header. A situation where you may need this is if the Pane (or Paneset) is wrapped in an unstyled element without any width/max-width set.  |  |
dismissible | bool or "last"| If true, pane will render a close (&times;) button in its firstMenu. If "last" is supplied, the button will render in the lastMenu. | false |
firstMenu | node | Component (typically an instance of `<PaneMenu>`) to render buttons or icons at the beginning of the header. |  |
lastMenu | node | Component (typically an instance of `<PaneMenu>`) to render buttons or icons at the far end of the header. |  |
actionMenuItems | array | Array of objects that will form an action menu which can be toggled by clicking on the pane header title |  | 
onClose | func | Callback fired when the pane is closed using its dismiss button. |  |
paneTitle | string or node | Text or text-rendering elements to appear in the pane header. |  |
paneTitleRef | func | function to set a ref to title element - great for managing focus when new panes are shown/updated. | | 
paneTitleAutoFocus | bool | If this prop is `true`, the pane title will automatically focus when the Pane mounts | |
appIcon | object | Render an AppIcon in the PaneHeader by passing an object with a key of `app` that matches an installed FOLIO app. Optionally you can pass a `key` in the same object which refers to a specific icon inside an app with the key of `app`, e.g. { app: 'instances', key: 'items' } |  |
contentPadding | number | Amount of padding (in pixels) to apply to Pane's content `<div>` | 16 |
noOverflow | bool | set to true if the Pane content is not expected to scroll. This can cure issues with flashing scrollbars on search result Panes. | false |
subheader | node | Render a component below the Pane's header. |  | false
