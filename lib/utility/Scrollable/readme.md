# Scrollable

Adds scroll functionality to area with uniform styling across browsers.

The component will automatically hide the scrollbar when it's not needed and it will also prevent content from jumping when content becomes scrollable.

## Basic Usage

```
import { Scrollable } from '@folio/stripes-components/lib/utility/Scrollable';

...
<Scrollable>
  <div>
    My content
  </div>
</Scrollable>
```

## Props

Name | type | description | default
--- | --- | --- | ---
noOverflow | bool | Disables scroll and returns a container with overflow: hidden; Useful for when a child element should be scrolled instead. | false
containerClass | string | Add class to scrolling container | ''
containerStyle | object | Add style to scrolling container | null
onScroll | function | Listen for scroll events. Fires on both X and Y direction | null
