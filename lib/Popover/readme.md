# Popover

Component to render a small pop-up "tip" once a trigger element is clicked. Clicking the target again should toggle the popover. Clicking outside of the popover will typically close it.

## Usage

Similar to `<Dropdown>`, `<Popover>` requires at least two children - their roles are defined by setting their `data-role` attributes to `target` or `popover`.
```
import Popover from '@folio/stripes-components/lib/Popover';
<Popover>
  <Button data-role="target">Test Popover</Button>
  <p data-role="popover">Lorem ipsum delor sit amet...</p>
</Popover>
```

## Props
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
