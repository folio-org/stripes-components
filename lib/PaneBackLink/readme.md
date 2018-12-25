# PaneBackLink

Renders an [`<IconButton>`](/?selectedKind=IconButton) with icon `arrow-left`. Above the `medium` breakpoint, it hides. This component is appropriate for instances of [`<Pane>`](/?selectedKind=Pane) that do not need to be closeable on larger screens. Example: the [`<Pane>`](/?selectedKind=Pane) listing settings for a module.

## Usage
Use with the `firstMenu` prop of a [`<Pane>`](/?selectedKind=Pane) or [`<PaneHeader>`](/?selectedKind=Pane&selectedStory=PaneHeader):

```
<Pane firstMenu={<PaneBackLink to="/my-module-root" />}>
...
</Pane>
```

`<PaneBackLink>` passes along all received props to its child [`<IconButton>`](/?selectedKind=IconButton).
