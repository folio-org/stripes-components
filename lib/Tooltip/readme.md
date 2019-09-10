# Tooltip
Renders a small tooltip on hover or focus to provide additional context for the user - most often used for `<IconButton>`'s or similar components that doesn't have a visible label.

**Note:** Tooltips should be used cautiously since [it can be difficult to make them completely accessible](https://inclusive-components.design/tooltips-toggletips/). Learn more in the accessibility section.

## Basic Usage
```js
  import { Tooltip } from '@folio/stripes/components';

  <Tooltip
    text="Delete"
    sub="Permanently deletes record" // Optional
  >
    {({ ref, ariaIds }) => (
      <IconButton
        ref={ref}
        icon="trash"
        aria-labelledby={ariaIds.text}
        aria-describedby={ariaIds.sub}
      />
    )}
  </Tooltip>
```

## Accessibility
It is very important to ensure that every part of a UI is accessible for all users – regardless of how they may operate the system.

The `<Tooltip>` won't be 100% accessible out of the box – it's up to you as a developer to provide the relevant information in an accessible way. This can be achieved in several ways and it must be tailored to the specific implementation of a given UI.

Using aria-attributes, you can provide the same information for all users. Here's some examples:

### Using aria-label
Passing the same string for both the `<Tooltip>` text prop and the `aria-label` of the trigger component will ensure that the contents of the tooltip is available for all users.

```js
const label = 'Delete';
  
<Tooltip
  title={label}
  id="my-tooltip"
>
  {({ ref, ariaIds }) => (
    <IconButton
      icon="trash"
      ref={ref}
      aria-label={label}
    />
  )}
</Tooltip>
```

### Using aria-labelledby and aria-describedby
If you want to render a tooltip with both a text and a sub, you can use `aria-labelledby` and `aria-describedby` to make the information available for screen reader users.

**Note:** `aria-labelledby` is announced by screen readers first, followed by `aria-describedby`. In some cases `aria-describedby` is made optional depending on the browser/screen reader combination. The `aria-label` trumps the `aria-labelledby` so if you want to announce both the text and the sub then you should either use `aria-labelledby` or a combination of `aria-labelledby` and `aria-describedby`.

Be aware that both the `aria-label` and `aria-labelledby` will override the visible text for certain elements, such as links and buttons.

```js
<Tooltip
  id="my-tooltip" // Required – it's used to generate prefixed aria ID's. E.g. my-tooltip-text and my-tooltip-sub
  text="Delete"
  sub="Deletes the record permanently"
>
  {({ ref, ariaIds }) => (
    <IconButton
      icon="trash"
      ref={ref}

      // Option 1 - this will read out the text first and then the sub afterwards
      aria-labelledby={ariaIds.text} // The primary information
      aria-describedby={ariaIds.sub} // The secondary information

      // Option 2 - this will read out both text and sub immidiately when the trigger is focused
      aria-labelledby={`${ariaIds.text} ${ariaIds.sub}`}
    />
  )}
</Tooltip>
```

## Usage with external ref
It is possible to pass your own ref to the `triggerRef`-prop if you don't want to use the provided ref for the tooltip trigger.

The ref external ref replaces the default ref and will be passed down using the render-prop pattern. It also allows for separating the trigger component and the tooltip. E.g.:

```js
  import { Tooltip } from '@folio/stripes/components';

  // Create ref
  const ref = React.createRef(null);

  // Pass ref to trigger
  <IconButton
    aria-label="Delete"
    icon="trash"
    ref={ref}
  />

  // Pass ref to the "triggerRef"-prop
  // Important: Place the <Tooltip> after your trigger component
  // Note: The "label" matches the aria-label on the trigger element, making it accessible for screen reader users
  <Tooltip
    text="Delete"
    triggerRef={ref}
  />
```

## Placements
Update the placement of the `<Tooltip>` relative to the trigger component using the `placement`-prop.

- bottom (default)
- top
- left
- right
- top-start
- top-end
- bottom-start
- bottom-end
- left-start
- left-end
- right-start
- right-end

## Props
Name | Type | Description | Required | Default
-- | -- | -- | -- | --
children | func | Renders the toggle using the render-prop pattern. The passed function receives an object with the `ref` that will be passed to the trigger. It also provides the prefixed aria ID's which can be used to associate the tooltip with the trigger component for screen reader users. | |
id | string | Serves as a prefix for the aria ID's that will be used to associate the tooltip with the trigger component for screen reader users | true |
placement | string | Defines the placements for the tooltip. See available placements above | | bottom
text | string | The label of the tooltip | true |
sub | string | Renders an optional sub-title below the label |
triggerRef | func | Pass a custom ref instead of using the internal ref | |
