# PaneMenu
Render pane menus for a `<Pane>` component via. the `firstMenu`- and `lastMenu`-props.

```js
import { IconButton, PaneMenu, PaneCloseLink } from '@folio/stripes/components';

const firstMenu = (
  <PaneMenu>
    <PaneCloseLink />
  </PaneMenu>
);

const lastMenu = (
  <PaneMenu>
    <IconButton
      icon="bookmark"
    />
  </PaneMenu>
);

<Pane 
  paneTitle="Pane Menu Example"
  lastMenu={lastMenu}
  firstMenu={firstMenu}
>
    // Pane Content...
</Pane>
```

## Props
Name | Type | Description
--- | --- | ---
children | node | Pass content to the PaneHeader component
