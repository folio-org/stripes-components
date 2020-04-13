# Paneset
Container/Manager for for `<Pane>` components and a pillar of layout for FOLIO modules.
### Usage

```js
import { Pane, Paneset } from '@folio/stripes/components';
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
onLayout | func | Used to apply a set of widths to the paneset under certain conditions from the application level | `() => null` |
nested | bool | Use if paneset is nested within a paneset. Applies relative positioning. | false |
static | bool | Applies static positioning to the paneset (instead of 'absolute'). | false |
isRoot | bool | This paneset will not report itself to an ascendant `<Paneset>`. This is necessary for `<Panesets>` rendered in `<Layer>` components. | false |
children | node | Set of panes and other components that render panes. | |

### Controlling pane widths

There are two ways to control the layout of panes based on application state - setting the `initialLayouts` prop allows you to easily handle differences from one set of panes to another. For more dynamic scenarios, the onLayout callback is available for you to inject the necessary pane widths based on application state, context among other variables. **User-resized widths override these settings.**

### initialLayouts

Example requirements might be for the "filter", "results", and "details" Panes to be "20%, 30%, and 50%" in width, respectively when all 3 panes ar visible, but only "20% and 80%" when just results and detail panes are visible. You can apply `initialLayouts` for the case as follows:

```
const layouts = [
  {
    'results-pane': '20%',
    'detail-pane': '80%',
  },
  {
    'filter-pane': '20%',
    'results-pane': '30%',
    'detail-pane': '50%',
  }
];

<paneset initialLayouts={layouts}>   ...
```

### onLayout

A similar example, but this time application state determines the behavior: ui-users has a standard 3-pane layout with filters, results and detail panes. When all 3 panes are visible, their default widths(set via `<Pane>`'s `defaultWidth` prop) are `20%` `30%` and `50%`, respectively... however, when the first pane (filters) is hidden, the widths should change to `20%` for the results list and `80%` for the detail view. The `onLayout` function can be set up to return an object of width values that is keyed using the id props of the panes that are present at the time.
The app uses a state field to determin whether or not the filters pane is rendered,`showFilters` so we can use that as well.
If the id's of the results list and detail panes are `resultspane` and `detailspane` then the implementation of the `onLayout` function would be as follows: 

```
const handlePaneLayout = ({ changeType }) => {
    if (
      changeType === 'removed' && // changeType from paneset
      !showFilter // app-level state to determine
    ) {
      return {
        'resultspane': '20%',
        'detailspane': '80%',
      };
    }
    return null;
  };
```

#### onLayout Parameters

Name | description
--- | ---
changeType | Relays the type of change internal to paneset. This is useful for applying widths under certain conditions. Potential values are: <br/>`'added'` When a pane is added to the set <br/>`'removed'` When a pane is removed from the set. <br/>`'paneset-resized'` When the entire paneset is resized. <br/>`'resize'` When an individual pane is resized.
nextLayout | An object keyed by id's for the set of panes being rendered. The values of the object are 0.
layoutCached | Boolean for whether or not the `nextLayout` set has a cached layout - this is automatically preferred over a return value for the function.
layoutCache | read-only value of the paneset's layout cache.
widths | If any, the widths of the cached layout. If there's no cached widths, this value is `null`

### Capturing Resized layouts

The `<Paneset>` also exposes a callback for when the user resizes panes. `onResize` passes an object with two properties: 
* `currentLayout` - the currently resized set
* `layoutCache` - the whole layoutCache from the paneset.

### Layout caching

Under the hood, Paneset will access its calculated widths via a cache for various combinations of panes. The cache items are nothing more than an object keyed by the id's of the panes holding width values. When a pane is resized by the user, the values for the cached layout are updated and the paneset will use those values any time a matching set of panes is rendered. This allows the paneset to maintain user-sized values across state changes, panes being added/removed etc... cached layouts are matched by both the number of panes and by the id's present. Different id's will mean a different cache entry.

If the pane widths are not maintained among state updates in your application, be sure that all of the panes rendered have id props.


