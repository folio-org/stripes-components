# AppIcon

Displays an app's icon in various sizes.

## Usage
AppIcon supports different ways of loading icons.

Option 1 is the recommended implementation but if needed (edge case) option 1 and 2 can be used.

```js
  import AppIcon from '@folio/stripes-components/lib/AppIcon';

  // 1. Use context (recommended)
  // Note: Make sure that the AppIcon has "stripes" in context as it relies on stripes.metadata.
  <AppIcon app="users" size="small" />

  // 2. Supply an object to the icon prop
  const icon = {
    src: '/static/some-icon.png',
    alt: 'My icon',
    title: 'My icon',
  };

  <AppIcon icon={icon} />

  // 3. Pass img as child
  <AppIcon>
    <img src="/static/my-icon.png" alt="My icon" />
  </AppIcon>

```

## Props
Name | Type | Description
-- | -- | --
app | string | The lowercased name of an app, e.g. "users" or "inventory". It will get the icon from metadata located in the stripes-object which should be available in React Context.
icon | object | Icon in form of an object
size | string | Determines the size of the icon. (small, medium, large)
style | object | For adding custom style to component
className | string | For adding custom class to component
tag | string | Choose HTML-element (defaults to a span element)
children | element | Optionally add icon as child element (img)
