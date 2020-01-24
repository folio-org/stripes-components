# PaneMenu
Render pane menus in the header of a `<Pane>`-component by passing the `firstMenu`- and `lastMenu`-props to either `<PaneHeader>` or `<Pane>`.

```js
import { PaneHeaderIconButton, PaneMenu, PaneHeader, PaneCloseLink } from '@folio/stripes/components';

const firstMenu = (
  <PaneMenu>
    <PaneCloseLink />
  </PaneMenu>
);

const lastMenu = (
  <PaneMenu>
    <PaneHeaderIconButton
      icon="bookmark"
    />
  </PaneMenu>
);

<Pane 
  renderHeader={renderProps => (
    <PaneHeader
      paneTitle="Pane Menu Example"
      lastMenu={lastMenu}
      firstMenu={firstMenu}
    />
  )}
>
    // Pane Content...
</Pane>
```

## Props
Name | Type | Description
--- | --- | ---
children | node | Pass content to the PaneHeader component
