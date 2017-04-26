# Change history for stripes-components

## pending
* Add `makeQueryFunction` util to replace `makePathFunction` which will be removed in a subsequent release.

## [0.6.1](https://github.com/folio-org/stripes-components/tree/v0.6.1) (2017-04-14)
* Added `fluidContentWidth` prop to `<Pane>` component. This suppresses `<Pane>` wrapping its content in a div with static minimum width.
* Added `defaultWidth` prop to `<Paneset>` in case paneset needs a specified width. Defaults to `'fill'`

## [0.6.0](https://github.com/folio-org/stripes-components/tree/v0.6.0) (2017-04-11)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.5.0...v0.6.0)

* Added `<Modal>` component. [docs](lib/Modal/readme.md)
* Added `dismissible` and `onClose` props to `<Pane>`. `dismissible` can be used to render a dismiss '&times;' button, with a corresponding handler supplied in `onClose` that will be triggered when the pane is dismissed. The module should use this handler to clean up any state or logic that triggered the pane's rendering. [docs](lib/Pane/readme.md)
* `<Layer>` renders its contents to the root of the containing `<Paneset>`. [docs](lib/Layer/readme.md)
* Prop `isRoot` added to `<Paneset>` - this should be used for full-width panesets added in new `<Layer>` components to ensure that the descendent `<Panes>` are tracked and sized appropriately. [docs](lib/Paneset/readme.md)
* Use `requestAnimationFrame` to improve rendering performance of `<Textfield>`
* Added 'browser' and 'node' environments to eslint configuration so that it will accept calls to browser functions such as `requestAnimationFrame`.

## [0.5.0](https://github.com/folio-org/stripes-components/tree/v0.5.0) (2017-03-28)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.4.0...v0.5.0)

* Add `<EditableList>` component.
* Add clear-field button to the `<TextField>` component.
* Add `columnMapping` prop to `<MultiColumnList>`
* `<MultiColumnList>` `onHeaderClick` callback is passed "name" and "alias" for the column in case `columnMapping` prop is supplied.

## [0.4.0](https://github.com/folio-org/stripes-components/tree/v0.4.0) (2017-03-22)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.3.0...v0.4.0)

* The `<IfPermission>` component now uses the stripes-core v0.4.0 API for permission-checking, and the stripes-core peer-dependency has been made explicit.

## [0.3.0](https://github.com/folio-org/stripes-components/tree/v0.3.0) (2017-03-17)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.2.0...v0.3.0)

* `transitionToParams` now uses the new release of [React Router](https://reacttraining.com/react-router/). This significantly changes the API for URL-derived props and for changing the URL.

## [0.2.0](https://github.com/folio-org/stripes-components/tree/v0.2.0) (2017-03-16)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.1.0...v0.2.0)

* Add the `<IfPermission>` component, which renders its children only if the specified permission is present.
* Change substitution syntax in the `queryTemplate` parameter of the `makePathFunction` utility function from `${query}` to `$QUERY`. The former misleading resembled ES6 string-template notations, but that's not really what was happening here.

## [0.1.0](https://github.com/folio-org/stripes-components/tree/v0.1.0) (2017-03-16)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.0.4...v0.1.0)

* Add the utility function `makePathFunction` and [its documentation](util/README.md).

## [0.0.4](https://github.com/folio-org/stripes-components/tree/v0.0.4) (2017-03-13)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.0.3...v0.0.4)

* Added Datepicker Component.
* Updated TextField Component to make use of validation styles/icons
* Updated Icon component to include validation icons for success, error, and a spinner for asynchronous validation in progress.
* Updated Dependencies in package.json to include moment.js, classnames, and react-overlays libraries.

## [0.0.3](https://github.com/folio-org/stripes-components/tree/v0.0.3) (2017-03-01)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.0.2...v0.0.3)

* Add new area, [`util`](util), for utility functions. This contrasts with `lib`, which contains utility components.
* Add new utility function `transitionToParams` -- see the Users UI module for an example of how to use it. Fixes STRIPES-216.
* Add [documentation](util/README.md) for `transitionToParams`.
* `<List>` warns if passed a falsy value for items.

## [0.0.2](https://github.com/folio-org/stripes-components/tree/v0.0.2) (2017-02-25)

* First version to have a documented change-log. Each subsequent version will
  describe its salient differences from the previous one.
* Includes the FilterGroups library.

