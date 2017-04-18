# Layer
Creates a new layer of `<Pane>`s or other UI components for your module. Renders its content via a [react-overlays Portal](https://react-bootstrap.github.io/react-overlays/#portals).

### Usage
```js
import Layer from '@folio/stripes-components/lib/Layer';
import Paneset from '@folio/stripes-components/lib/Paneset';

// boolean to control the rendering of the layer...
let showLayer = true;

<Paneset>
    // Base Paneset contents ...
    <Layer isOpen={showLayer} >
        <Paneset isRoot>
            //...Layered Paneset contents...
        </Paneset>
    </Layer>
</Paneset>
```

### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
isOpen | bool | Optional prop to control rendering of the layer's child components within a div with role "dialog" (A full-module modal). | |
container | node | DOM element or component where the rendered elements should reside. Appends content to the root of the ascendant `Paneset` by default. | | 

