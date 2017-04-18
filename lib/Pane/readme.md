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
```js
const paneStartMenu = <PaneMenu><button><Icon icon="bookmark" /></button></PaneMenu>
<Pane defaultWidth="50%" paneTitle="Example First Menu" firstMenu={paneStartMenu}>
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


### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
defaultWidth | string percentage or `"fill"` | Tells the pane the percentage of the paneset that it should occupy. A string percentage (`"25%"`) will render a pane with a width of 25% of its containing element. The string `"fill"` will cause the pane to occupy any remaining space in the paneset after percentage-sized panes are accounted for. |  | &#10004;
dismissible | bool or "last"| If true, pane will render a close (&times;) button in its firstMenu. If "last" is supplied, the button will render in the lastMenu. | false | 
firstMenu | node | Component (typically an instance of `<PaneMenu>`) to render buttons or icons at the beginning of the header. |  | 
lastMenu | node | Component (typically an instance of `<PaneMenu>`) to render buttons or icons at the far end of the header. |  | 
onClose | func | Callback fired when the pane is closed using its dismiss button. |  | 
paneTitle | string or node | Text or text-rendering elements to appear in the pane header. |  | 

