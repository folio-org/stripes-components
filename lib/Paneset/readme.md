# Paneset
Container/Manager for for `<Pane>` components and a pillar of layout for FOLIO modules.
### Usage

```js
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
//..
<Paneset>
    <Pane defaultWidth="33%">
    </Pane>
    <Pane defaultWidth="fill">
    </Pane>
    <Paneset nested>
        // nested Paneset contents...
    </Paneset>
</Paneset>
```

Descendent `<Panes>` report themselves to the `<Paneset>`. Even if the `<Pane>` is wrapped in something else (like a `<Route>` component, for example) it will report to the paneset and sized appropriately.

#### Panesets within Layers
By default, `<Paneset>` will report itself to its Paneset ancestors for appropriate tracking/sizing. To suppress this, you can use the `isRoot` prop. This example shows a typical occurrence of this where a `<Paneset>` is used within a `<Layer>` component:

```js
<Paneset>
    // Outer Paneset contents ...
    <Layer isOpen>
        <Paneset isRoot>
            //...Layered Paneset contents...
        </Paneset>
    </Layer>
</Paneset>
```

### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
nested | bool | Use if paneset is nested within a paneset. Applies relative positioning. | false |
static | bool | Applies static positioning to the paneset (instead of 'absolute'). | false | 
isRoot | bool | This paneset will not report itself to an ascendant `<Paneset>`. This is necessary for `<Panesets>` rendered in `<Layer>` components. | false | 
children | node | Set of panes and other components that render panes. | |
