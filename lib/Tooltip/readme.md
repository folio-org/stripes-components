# Tooltip
Renders a small tooltip on hover or focus.

## Basic Usage
```js
  import { Tooltip } from '@folio/stripes/components';

  <Tooltip
    label="Delete"
    shortcut="CMD+D" // Optional
  >
    {({ ref }) => (
      <IconButton
        aria-label="Delete (CMD+D)"
        icon="trash"
        ref={ref}
      />
    )}
  </Tooltip>
```

## Usage with external ref
It is possible to pass your own ref to the `triggerRef`-prop if you don't want to use the provided ref for the tooltip trigger.

```js
  import { Tooltip } from '@folio/stripes/components';

  // Create ref
  const ref = React.createRef(null);

  // Pass ref to trigger
  <IconButton
    aria-label="Delete (CMD+D)"
    icon="trash"
    ref={ref}
  />

  // Pass ref to the "triggerRef"-prop
  // Important: Place the <Tooltip> after your trigger
  <Tooltip
    label="Delete"
    shortcut="CMD+D" // Optional
    triggerRef={ref}
  />
```

## Props
Name | Type | Description
-- | -- | --
children | func | Renders the toggle using the render-prop pattern. The passed function receives an object with the `ref` that will be passed to the trigger.
label | node/string | The label of the tooltip
shortcut | node/string | Renders an optional shortcut below the label
triggerRef | func | Pass a custom ref instead of using the internal ref
