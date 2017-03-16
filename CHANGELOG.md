# Change history for stripes-components

## 0.2.0 (Thu 16 Mar 14:55:09 GMT 2017)

* Add the `<IfPermission>` component, which renders its children only if the specified permission is present.
* Change substitution syntax in the `queryTemplate` parameter of the `makePathFunction` utility function from `${query}` to `$QUERY`. The former misleading resembled ES6 string-template notations, but that's not really what was happening here.

## 0.1.0 (Tue Mar 14 17:00:57 GMT 2017)

* Add the utility function `makePathFunction` and [its documentation](util/README.md).

## 0.0.4 (Mon Mar 13 13:20:20 GMT 2017)

* Added Datepicker Component.
* Updated TextField Component to make use of validation styles/icons
* Updated Icon component to include validation icons for success, error, and a spinner for asynchronous validation in progress.
* Updated Dependencies in package.json to include moment.js, classnames, and react-overlays libraries.

## 0.0.3 (Wed Mar  1 23:18:26 GMT 2017)

* Add new area, [`util`](util), for utility functions. This contrasts with `lib`, which contains utility components.
* Add new utility function `transitionToParams` -- see the Users UI module for an example of how to use it. Fixes STRIPES-216.
* Add [documentation](util/README.md) for `transitionToParams`.
* `<List>` warns if passed a falsy value for items.

## 0.0.2 (Sat Feb 25 17:39:56 GMT 2017)

* First version to have a documented change-log. Each subsequent version will
  describe its differences from the previous one.
* Includes the FilterGroups library.

