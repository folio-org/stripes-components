# AppIcon

Displays an app's icon in various sizes.

## Usage
AppIcon supports different ways of loading icons.

***1. Use context (recommended)***
```js
  import AppIcon from '@folio/stripes-components/lib/AppIcon';

  // Note: Make sure that the AppIcon has "stripes" in context as it relies on stripes.metadata.
  <AppIcon app="users" size="small" />
  ```
  Optional: You can supply an iconKey if you need a specific icon within an app. If the specific icon isn't bundled with the app it will simply render a placeholder.
```js
  <AppIcon app="inventory" iconKey="holdings" />
```

***2. Supply an object to the icon prop***
```js
  const icon = {
    src: '/static/some-icon.png',
    alt: 'My icon',
    title: 'My icon',
  };

  <AppIcon icon={icon} />
  ```

**Add a label to the icon by passing it as a child**
  ```js
  <AppIcon>
    Users
  </AppIcon>
```

## Props
Name | Type | Description
-- | -- | --
app | string | The lowercased name of an app, e.g. "users" or "inventory". It will get the icon from metadata located in the stripes-object which should be available in React Context.
iconKey | string | A specific icon-key for apps with multiple icons. Defaults to "app" which corresponds to the required default app-icon of an app.
iconAriaHidden | bool | Applies aria-hidden to the icon element
icon | object | Icon in form of an object
size | string | Determines the size of the icon. (small, medium, large)
style | object | For adding custom style to component
className | string | For adding custom class to component
tag | string | Choose HTML-element (defaults to a span element)
children | node | Add content next to the icon - e.g. a label
