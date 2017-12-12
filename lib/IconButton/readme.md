# IconButton

Renders a square button with a centered icon.

## Basic Usage
```
  import IconButton from '@folio/stripes-components/lib/IconButton';

  <IconButton
    icon="comment"
    badgeCount="3"
    onClick={...}
  />
```

## Props
Name | Type | Description
icon | string | Select the icon. You can use any icon that's available in the Icon-component
className | string | Append your own CSS class
style | object | Set the inline style
onClick | function | Attach an event handler
badgeCount | string / number | Display a small number badge on the IconButton
id | string | Adds an id attribute to the button
title | string | Adds a title attribute to the button
ariaLabel | string | Adds an aria label to the button
