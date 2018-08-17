# Icon
Component for rendering a variety of FOLIO icons.

## Basic Usage
```js
import { Icon } from '@folio/stripes-components/lib/Icon';

<Icon
  icon="bookmark"
  size="small"
  iconClassName="myClass"
/>

// With a label:

<Icon 
  icon="trashBin"
  iconPosition="end"
>
  Delete
</Icon>
```

## Props
Name | type | description | default |
--- | --- | --- | ---
icon | string | Sets icon to be rendered. See icon list for possible options | default
size | string | Sets the icon size (small, medium, large) | medium
title | string | Text that appears in a browser-native tooltip when icon is hovered |
iconRootClass | string | Applies a custom css class to the component's internal div. This is useful for applying custom hover interaction. | 
iconClassName | string | Applies a custom css class name directly to icon | stripes__icon
children | node, string | Adds content next to the icon. Useful for adding a label to an icon. | undefined
iconPosition | string | Sets the the position of the icon. Can be set to "start" and "end". Note: This is only relevant when the "children"-prop is utilized. | start
