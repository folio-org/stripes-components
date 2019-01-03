# PaneCloseLink

Renders an `<IconButton>` with icon `arrow-left`. Above the `medium` breakpoint, it instead displays the `times` icon. This component is appropriate for instances of `<Pane>` that should appear closeable on larger screens. Example: the detail `<Pane>` in a search layout.

## Usage
Use with the `firstMenu` prop of a `<Pane>` or `<PaneHeader>`:

```
<Pane firstMenu={<PaneCloseLink to="/my-module-root" />}>
...
</Pane>
```

`<PaneCloseLink>` passes along all received props to its child `<IconButton>`.
