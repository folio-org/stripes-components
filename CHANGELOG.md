# Change history for stripes-components

## [0.15.0](https://github.com/folio-org/stripes-components/tree/v0.15.0) (2017-06-14)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.14.0...v0.15.0)

* In `makeQueryFunction`, the `sort` parameter is now a comma-separated list of criteria. Towards UIU-83.
* `<Datepicker>` pulls locale from stripes object.

## [0.14.0](https://github.com/folio-org/stripes-components/tree/v0.14.0) (2017-06-13)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.13.0...v0.14.0)

* `<Datepicker>` uses `locale` prop to set default presentational date format.
* `<MultiColumnList>` index of rows exposed to `formatter` functions.
* `<MultiColumnList>` bug fix for component not updating when supplied new value for `visibleColumns` prop.
* Support for reverse sorting, UIU-81:
  * makeQueryFunction supports reverse sorting ('`-`' prefixing sort-field).
  * In `<MultiColumnList>`, getHeaderClassName uses the ascending/descending styles only on the current sorting header.
  * In `<MultiColumnList>`, add CSS pseudoclasses for `.ascending::after` and `.descending::after`.

## [0.13.0](https://github.com/folio-org/stripes-components/tree/v0.13.0) (2017-06-09)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.12.0...v0.13.0)

* Top <Settings> link is highlighted by default. Fixes the last part of STRIPES-357.
* Add the `<IfInterface>` component, which renders its children only if the specified server-side interface is available at a compatible version.

## [0.12.0](https://github.com/folio-org/stripes-components/tree/v0.12.0) (2017-06-08)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.11.2...v0.12.0)

* `<MultiColumnList>` supports infinite-scroll functionality via the `virtualize` prop. This comes with a few other updates to the API such as the `autosize` prop and `onNeedMoreData`. See [docs](lib/MultiColumnList/readme.md)
* `<MultiColumnList>` has 'fixed' column headers that will remain visible when the body of the list is scrolled.
* `<Pane>` will not automatically set a minimum width to its content's wrapping div, opting for fluid width as a default. 

## [0.11.2](https://github.com/folio-org/stripes-components/tree/v0.11.2) (2017-06-08)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.11.1...v0.11.2)

* Add `create-react-class` to dependencies, since this is needed by the modified version of react-hotkeys that was provided in v0.11.0.

## [0.11.1](https://github.com/folio-org/stripes-components/tree/0.11.1) (2017-06-07)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.11.0...v0.11.1)

* Add `mousetrap` to dependencies, since this is needed by the modified version of react-hotkeys that was provided in v0.11.0.

## [0.11.0](https://github.com/folio-org/stripes-components/tree/v0.11.0) (2017-06-07)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.10.1...v0.11.0)

* `<HotKeys>` component allow for applying shortcut key combinations to modules or sub-sections of modules.
*  Layout Grid - using [react-flexbox-grid](https://roylee0704.github.io/react-flexbox-grid/) to replace the float-based grid from react-bootstrap. [docs](lib/LayoutGrid/readme.md)
* `<Select`> component will now correctly display a placeholder value if there is one.

## [0.10.1](https://github.com/folio-org/stripes-components/tree/v0.10.1) (2017-06-05)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.10.0...v0.10.1)

* `<Datepicker>` - fix multiple issues with date navigation and focus management. (STRIPES-398)

## [0.10.0](https://github.com/folio-org/stripes-components/tree/v0.10.0) (2017-06-01)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.9.0...v0.10.0)

* `<Settings>` component now sorts settings pages by label. Implements STRIPES-358.
* `<TextField>` hides clear "&#10005;" when `readOnly` prop is true.
* `<Datepicker>` changed 'format' prop to 'DateFormat' for better cooperation with redux-form `<Field>` component.
* `<Datepicker>` hides clear and calendar controls, disables functionality when `readOnly` prop is true.
* Update stripes-core dependency to 1.7.0, so we get the Stripes object on the context.
* `<IfPermission>`, `<Pluggable>` and `<Settings>` now all take the Stripes object from the React context rather then expecting it to be passed in as a prop. Fixes STRIPES-395.

## [0.9.0](https://github.com/folio-org/stripes-components/tree/v0.9.0) (2017-05-22)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.8.0...v0.9.0)

* `<Pluggable>` component now honours the plugin preferences provided in the Stripes object. These are available from stripes-core v1.6.0, and the peer-dependency is updated accordingly.
* `<Settings>` component now passes the `label` part of the settings object down into the component.

## [0.8.0](https://github.com/folio-org/stripes-components/tree/v0.8.0) (2017-05-17)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.7.0...v0.8.0)

* Add the `<Pluggable>` component. Implements Stripes plugins (STRIPES-379).
* Fix a couple of minor JS-console warnings.

## [0.7.0](https://github.com/folio-org/stripes-components/tree/v0.7.0) (2017-05-03)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.6.1...v0.7.0)

* Add `makeQueryFunction` util to replace `makePathFunction` which will be removed in a subsequent release.
* Add `<Settings>` component to render top-level settings pages for Stripes modules.

## [0.6.1](https://github.com/folio-org/stripes-components/tree/v0.6.1) (2017-04-14)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.6.0...v0.6.1)

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

