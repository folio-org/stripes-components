# Icon
Component for rendering a variety of FOLIO icons.

To see icons you can use, check out our [available icons list](https://folio-org.github.io/stripes-components/?path=/story/icon--available-icons)

## Basic Usage
```js
import { Icon } from '@folio/stripes/components';

<Icon
  icon="bookmark"
  size="small"
  iconClassName="myClass"
/>

// With a label:

<Icon
  icon="trash"
  iconPosition="end"
>
  Delete
</Icon>
```

## Custom icon
It is possbile to render custom icons by passing a function that returns a `<svg>`.

When adding custom icons please make sure that:
- **The SVG is united and expanded** <br />
_Since these icons are meant to be monochrome and simple, it should be possible to expand and unite the contents of the vector before exporting. This removes extraneous attributes, strokes, paths, inline styles etc. If you are using e.g. illustrator, you can find more information here: https://helpx.adobe.com/illustrator/using/combining-objects.html._

- **The SVG is cleaned** <br />
_When exported from e.g. Adobe Illustrator, SVG files often have unneeded attributes such as id, class etc. These should be removed. You can use a tool like https://jakearchibald.github.io/svgomg to minify and clean your SVG-files._

- **The SVG has a viewBox of "0 0 32 32"** <br />
_This ensures a persistent look and feel of the rendered icons. This prop will automatically be applied when the props are spread onto the `<svg>`-element_

**Tip for creating icons:** Grab the SVG markup from an existing icon (inspect in the browser and copy) and save it as a `.svg`-file. Then open this file in e.g. Adobe Illustrator and update it's contents. This way you make sure that your icon has the correct size and viewbox. You can even use the existing icon as guide for adjusting the size of the icon itself.

```javascript
// Make a function that returns your SVG markup
const icon = props => (
  <svg xmlns="http://www.w3.org/2000/svg" {...props}> /* Remember to spread the props onto the svg-element */
    <path d="M19.9 2.4v10.4l9.7-5.2zM2.4 29.6l9.7-5.2-9.7-5.2zm17.5 0l9.7-5.2-9.7-5.2z" />
  </svg>
);

// Pass the custom icon function to <Icon>
<Icon icon={icon} />
```

## Props
Name | type | description | default |
--- | --- | --- | ---
icon | string, func | Sets icon to be rendered. See icon list for possible options. You can render a custom icon by passing a function that returns a `<svg>`. Read more about this in the "Custom icon" section above | default
size | string | Sets the icon size (small, medium, large) | medium
aria-label | string | Applies aria-label attribute to icon. Camel-case `ariaLabel` is also supported |
iconRootClass | string | Applies a custom css class to the component's internal div. This is useful for applying custom hover interaction. |
iconClassName | string | Applies a custom css class name directly to icon | stripes__icon
children | node, string | Adds content next to the icon. Useful for adding a label to an icon. | undefined
iconPosition | string | Sets the the position of the icon. Can be set to "start" and "end". Note: This is only relevant when the "children"-prop is utilized. | start
iconStyle | string | Changes the style of the icon. Currently, the only style available is "action" | undefined
status | string | Colors the icon. Currently supported values are "error", "warn", "success", or undefined (for no styling). | undefined
tabIndex | number | Sets a custom tabIndex on the element |
