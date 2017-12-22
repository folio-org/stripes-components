# Icon
Component for rendering a variety of FOLIO icons.

## Basic Usage
```
import { Icon } from '@folio/stripes-components/lib/Icon';

<Icon
  icon="bookmark"
  size="small"
  iconClassName="myClass"
/>
```

## Props
Name | type | description | default |
--- | --- | --- | ---
icon | string | Sets icon to be rendered. See icon list for possible options | ICON |
size | string | Sets the icon size (small, medium, large) | medium |
title | string | Text that appears in a browser-native tooltip when icon is hovered | |
iconRootClass | string | applies a custom css class to the component's internal div. This is useful for applying custom hover interaction. | |
iconClassName | string | applies a custom css class name directly to icon | stripes__icon |
