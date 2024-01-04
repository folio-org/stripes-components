# Loading (spinners)

Components for loading animations for various scenarios within your application.

## `<Loading>`: a basic, standalone loading spinner

| Property | Type | Description | Default | Required |
| --- | --- | --- | --- | --- |
| size | `small`, `medium`, `large`, or `xlarge` | The size of the loading icon | `medium` | |
| useCurrentColor | boolean | If the current element's CSS text `color` should be used instead of the default grey | `false` | |

## `<LoadingPane>`: a Pane with a loading spinner

For use within existing `<Paneset>`s. Accepts the props of `<Pane>`.

Accepts all properties of [<Pane>](https://github.com/folio-org/stripes-components/blob/master/lib/Pane/readme.md#props), however,
`defaultWidth` is optional (set to `fill` by default).  Any provided `children` will be ignored.

## `<LoadingView>`: for fullscreen views

Accepts the same props as `<LoadingPane>`, with the addition of `panesetProps`.  `panesetProps` will be passed to the underlying
`<Paneset>` and all other props will be passed to the underlying `<Pane>`.
