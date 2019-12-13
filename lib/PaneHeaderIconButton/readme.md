# PaneHeaderIconButton
A modified version of `<IconButton>` made specifically for the `<PaneHeader>`-component.

## Basic Usage
Below is a basic example of how to use the `<PaneHeaderIconButton>`-component. For more examples, see the readme for `<PaneHeader>`.

```js
  import { Pane, PaneMenu, PaneHeader, PaneHeaderIconButton } from '@folio/stripes/components';

  <Pane
    renderHeader={renderProps => (
      <PaneHeader
        {...renderProps}
        paneTitle="PaneHeaderIconButton Example"
        firstMenu={
          <PaneMenu>
            <PaneHeaderIconButton
              icon="times"
              onClick={onClose}
            />
          </PaneMenu>
        }
        lastMenu={
          <PaneMenu>
            <PaneHeaderIconButton
              icon="edit"
              onClick={onEdit}
            />
            <PaneHeaderIconButton
              icon="tags"
              onClick={onViewTags}
            />
          </PaneMenu>
        }
      />
    )}
  >
    Content here..
  </Pane>
```

## Props
`<PaneHeaderIconButton>` accepts the same props as `<IconButton>`. 

Go to the `<IconButton>`-readme to learn more.