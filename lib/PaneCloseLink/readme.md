# PaneCloseLink

Renders an [`<IconButton>`](/?selectedKind=IconButton) with icon `arrow-left`. Above the `medium` breakpoint, it instead displays the `times` icon. This component is appropriate for instances of [`<Pane>`](/?selectedKind=Pane) that should appear closeable on larger screens. Example: the detail [`<Pane>`](/?selectedKind=Pane) in a search layout.

## Usage
Use with the `firstMenu` prop of a [`<Pane>`](/?selectedKind=Pane) or [`<PaneHeader>`](/?selectedKind=Pane&selectedStory=PaneHeader):

```
<Pane firstMenu={<PaneCloseLink to="/my-module-root" />}>
...
</Pane>
```

`<PaneCloseLink>` passes along all received props to its child [`<IconButton>`](/?selectedKind=IconButton).
