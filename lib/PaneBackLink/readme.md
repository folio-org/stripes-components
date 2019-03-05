# PaneBackLink

Renders an `<PaneHeaderIconButton>` with icon `arrow-left`. Above the `medium` breakpoint, it hides. This component is appropriate for instances of `<Pane>` that do not need to be closeable on larger screens. Example: the `<Pane>` listing settings for a module.

## Usage
Use with the `firstMenu` prop of a `<Pane>` or `<PaneHeader>`:

```
<Pane firstMenu={<PaneBackLink to="/my-module-root" />}>
...
</Pane>
```

`<PaneBackLink>` passes along all received props to its child `<PaneHeaderIconButton>`.
