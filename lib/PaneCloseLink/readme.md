# PaneCloseLink

Renders an `<PaneHeaderIconButton>` with icon `arrow-left`. Above the `medium` breakpoint, it instead displays the `times` icon. This component is appropriate for instances of `<Pane>` that should appear closeable on larger screens. Example: the detail `<Pane>` in a search layout.

## Usage
Use with the `firstMenu` prop of a `<PaneHeader>`:

```js
import { Pane, PaneMenu, PaneHeader, PaneCloseLink } from '@folio/stripes/components';

<Pane 
  renderHeader={renderProps => (
    <PaneHeader 
      firstMenu={
        <PaneMenu>
          <PaneCloseLink to="/my-module-root" />
        </PaneMenu>
      }
    />
  )}
>
...
</Pane>
```

`<PaneCloseLink>` passes along all received props to its child `<PaneHeaderIconButton>`.
