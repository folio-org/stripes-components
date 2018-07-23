# IconWithText
Renders an icon with an inline label. 

Useful for displaying icons with associated labels in a consistent way across the platform. The component can be used inside other existing components or as a standalone component.

## Basic Usage
```js
import IconWithText from '@folio/stripes-components/lib/IconWithText';

// Render a regular Icon
<IconWithText
    text="Bookmark"
    icon="bookmark"
    iconPosition="end"
    paddingEnd
/>

// Render an AppIcon
<IconWithText
    text="Holdings"
    app="inventory"
    icon="holdings"
    paddingStart
/>
```

## Props
Below are the component specific props for this component. Additional props are spread on the root element making it possible to add any additional desired prop to the root element.

Name | Type | Description | Default
-- | -- | -- | --
app | string | Reference a Folio-app for displaying bundled icons (See [AppIcon](/?selectedKind=AppIcon) for more information) | undefined
className | string | Add additional CSS classes to the root element | undefined
icon | string | Determines which icon that should be rendered. If the "app"-prop is provided it will reference the "iconKey" of [AppIcon](/?selectedKind=AppIcon). If no "app"-prop is provided it will reference the available icons for the [Icon](/?selectedKind=Icon)-component. | undefined
iconPlacement | string | Determines the position of the icon. Supports "start" and "end" | start
paddingEnd | boolean | Adds padding in the end of the component | false
paddingStart | boolean | Adds padding in the start of the component | false
block | boolean | Changes display from inline-flex to flex making the component full width | false
text | string, node | The text of the component. It's also possible to pass another component/node. | undefined