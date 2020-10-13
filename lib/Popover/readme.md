# Popover
Component to render a small pop-up "tip" once a trigger element is clicked. Clicking the target again should toggle the popover. Clicking outside of the popover will typically close it.

## Usage
Similar to `<Dropdown>`, the `<Popover>` will render it's children inside an overlay and the `renderTrigger`-prop renders the button that triggers the overlay.

```js
import { Popover } from '@folio/stripes/components';

<Popover 
  renderTrigger={({ open, ref, toggle, }) => (
    <Button
      onClick={toggle}
      ref={ref}
    >
      {open ? 'Close' : 'Open'}
    </Button>
  )}
>
  Lorem ipsum delor sit amet...
</Popover>
```

## Controlled
By default, the `<Popover>` handles it's open state internally. If you need to control the `<Popover>` externally, you can pass an `open`-prop which controls the visibility of the overlay and an `onToggle`-prop that handles flipping the open state.

```js
const [open, setOpen] = useState(fale);

<Popover
  open={open}
  onToggle={() => setOpen(!open)}
  renderTrigger={({ open, ref, toggle, }) => (
    <Button
      onClick={toggle}
      ref={ref}
    >
      {open ? 'Close' : 'Open'}
    </Button>
  )}
>
  Lorem ipsum delor sit amet...
</Popover>
```

## Props
Name | Type | Description | Default | Required
--- | --- | --- | --- | ---
anchorRef | func, object | Pass a ref to an alternative anchor element. The anchor is the element that the popover attaches to. The `<Popover>` will automatically generate a ref that will be passed down to the trigger element via. the `renderTrigger`-prop. The default ref will be replaced by the ref passed to the `anchorRef`-prop. | |
children | func, node | Renders the contents of the popover overlay. Passing a function will enable accessing the same render-props that is passed to the `renderTrigger`-function. This is useful for e.g. passing down the `toggle`-function to a "close"-button inside the popover overlay. | |
className | string | Applies a custom class name for the popover overlay. | |
modifiers | object | Pass modifiers for the internal `<Popper>`-component. See the `<Popper>`-documentation for more information. | |
noPadding | bool | Removes the default padding on the popover overlay. | false |
onToggle | func | A callback function for toggling the popover's open state. This is only relevant if you are manually controlling the open state externally. | |
offset | number | Sets the offset (px) from the popover overlay to the anchor/trigger element | 5 |
open | bool | Controls the popover open state. This is only relevant if you need to be able to close the popover externally. Remember to also pass an `onToggle`-callback that toggles the external open state. | |
placement | string | Determines the placement of the popover overlay relative to the trigger button/anchor element. See the available placements in the basic usage example/story. | bottom |
popperProps | object | Pass additional props to the internal `<Popper>`-component. See the documentation for the `<Popper>`-component to learn more. | |
renderTrigger | func | Renders the trigger button/anchor element. The function will receive an object that contains a `ref`, an open state and a `toggle`-function. It's required to pass the ref down to either the toggle button or some anchor element. | |

## Legacy Popover
The previous `<Popover>` component API is still working for older implementations. However, it is recommended that you update your implementations to use the new component API as support for the deprecated component API will be removed in a future release.

You can see the documentation for the legacy popover below.

Name | type | description | default | required
--- | --- | --- | --- | ---
position | string | Position of pop-up relative to the target. Can be `top`, `bottom`, `start`, or `end` | `bottom` |
alignment | string | Position along the cross-axis. Can be centered, or align with an edge of the target. Can be set to `center`, `start`, or `end` | `center` |
children | arrayOf(node) | Requires two children one with `data-role="target"` and another with `data-role="popover"`. Ideally, the target child is an interactive element - a `<Button>`, for instance. The popover can be any dom element. | | &#10004;
noPadding | bool | Removes padding from popover content if set to true | `false` |
offset | number | Distance of the popover toward or away from the target. | 0 |
activeClass | string | Adds the activeClass to the wrapper once the Popover is open |  |

## Positioning
Setting `position` of "top" and `alignment` of "end" will render the popover above the trigger, aligned with the 'end' of the target's bounding box.

```
<Popover position="top" alignment="end">
  <Button data-role="target">Top Popover3</Button>
  <p data-role="popover">Lorem ipsum delor sit amet...</p>
</Popover>
```
