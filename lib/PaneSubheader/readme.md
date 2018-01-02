# PaneSubheader

Basic styling component to render UI content just below a `<Pane>`'s header.

## Usage
Pass in as the `subheader` prop of `<Pane>` component;

```
const sbh = (
      <PaneSubheader>
        <SegmentedControl activeId="instanceLevel">
          <Button id="instanceLevel">Instance</Button>
          <Button id="holdingsLevel">Holdings</Button>
          <Button id="itemsLevel">Items</Button>
        </SegmentedControl>
      </PaneSubheader>
    );

...
<Pane id="pane-instancedetails" subheader={sbh} > ...
```
