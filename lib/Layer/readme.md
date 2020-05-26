# Layer
Creates a new layer of `<Pane>`s or other UI components for your module. Renders its content via a [React Portal](https://reactjs.org/docs/portals.html).

### Usage
```js
import { Layer, Paneset } from '@folio/stripes/components';

// boolean to control the rendering of the layer...
let showLayer = true;

<Paneset>
    // Base Paneset contents ...
    <Layer isOpen={showLayer} contentLabel="demonstration layer">
        <Paneset isRoot>
            //...Layered Paneset contents...
        </Paneset>
    </Layer>
</Paneset>
```

### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`autoFocus` | bool | If no layer content is focused via other focus-management methods, the `<Layer>`'s container will be focused. | `true` |
`isOpen` | bool | Control rendering of the layer's child components within a div with role "dialog" (A full-module modal). | | required
`container` | node | DOM element or component where the rendered elements should reside. Appends content to the root of the ascendant `Paneset` by default. | |
`contentLabel` | string | applied as the `aria-label` attribute on the `<Layer>`'s containing div. Warns if not applied. | |
`afterClose` | func | Callback for after the `<Layer>` has closed. Handle focus management for accessible code here! | `()=>{}` |
`afterOpen` | func | Callback for after the `<Layer>` has opened. | `()=>{}` |
`enforceFocus` | bool | Whether or not the modal should trap focus within itself (best for accessibility) | `true` |
`inRootSet` | bool | if no `container` prop is provided, `<Layer>` will render into the root of its parent paneset. `InRootSet` pushes further by rendering the layer to the top-most paneset in the tree. Consider using this if your `<Layer>` is used within a nested paneset. Modules' settings have this structure. | | 

### A11y practices
The `<Layer>` is very similar to a modal dialog and focus management should be accounted for accordingly. When opened, focus will move to the rendered content div (unless a child element has already assumed focus via `autoFocus` or some other means.) Focus should be managed appropriately by the application when the `<Layer>` is closed. The `afterClose` prop can be used for this.

```
// send focus back to trigger when layer closes.
focusAfter() {
    this.layerToggle.current.focus();
}

<Paneset>
  // Base Paneset contents ...
  <Button buttonRef={this.layerToggle} onClick={this.toggleLayer}>Toggle Layer</Button>
  <Layer
    isOpen={showLayer}
    afterClose={this.focusAfter}
    contentLabel="demonstration layer"
  >
    {/* Layer contents */}
  </Layer>
</Paneset>
```
