# IconButton

Renders a square button with a centered icon.

## Basic Usage
```
  import { IconButton } from '@folio/stripes/components';

  <IconButton
    icon="comment"
    badgeCount="3"
    onClick={...}
  />
```

## Props
Name | Type | Description
-- | -- | --
icon | string | Select the icon. You can use any icon that's available in the Icon-component
className | string | Append your own CSS class
type | string | Set the type of the button (defaults to "button")
size | string | Set the size (small 24x24 px / medium 44x44 px)
iconSize | string | Size of the icon inside the button (small, medium or large)
style | object | Set the inline style
onClick | function | Attach an event handler
href | string | Turns the button into a link (instead of using an onClick handler)
to | string or object | accepts `to` prop similar to `<Link>` from `react-router` [Details for `<Link>`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/Link.md).
badgeCount | string / number | Display a small number badge on the IconButton
id | string | Adds an id attribute to the button
innerClassName | string | Apply a custom class name to the inner element of the component
aria-label | string | Adds an aria label to the button. Camel-case prop name `ariaLabel` is also supported.
autoFocus | bool | If this prop is `true`, component will automatically focus on mount | |
disabled | bool | If this prop is 'true', component will render a disabled button
