# `stripes-components` utility functions

This `util` area contains utility functions, whereas `../lib` contains utility components.

## this.transitionToParams(params)

Must be invoked with `this` bound to a React component that is beneath a React Router match, so that `this.props.location` and `this.context.router` are both defined.

Takes as its argument an object containing _key_: _value_ pairs. It transitions to a URL that is the same as the present one except that the specified query parameters are included -- replacing the same-named parameters if they already exist, and adding new parameters where they do not.

For example, if you are at the URL:
```
http://localhost:3000/users?filters=active.Active&sort=Name
```
and invoke this function as:
```
this.transitionToParams({ query: 'water', sort: 'Email' })
```
The application will transition to the new URL:
```
http://localhost:3000/users?filters=active.Active&sort=Water&query=Email
```
The `filters` query parameter is unaffected (since it was not included in the parameters passed in), the old `sort` value `Name` is replaced by the new value `Email`, and the new parameter `query` is added with the value `water`.

## getFocusableElements
  getFocusableElements.js exposes four functions to help track focus elements within a given container. They construct a "focus list" and then allow the user to sweep through it, or jump to the beginning/end of said list.


### getNextFocusable/getPreviousFocusable(currentElement, includeContained = true, onlyContained = false, loop = true, nullOnExit = false)
  These functions will return the "next" or "previous" focusable element within some scope.

  `currentElement` takes a HTML element, such as given by `someRef.current`, or `document.getElementById('some-id')`;.
  `includeContained` controls whether the focusable list includes any child elements of the `currentElement`.
  `onlyContained` controls whether the list of focusable elements is restricted to only those which are children of the `currentElement`. (Note, if `includeContained` is false this variable will be ignored)

  For example, setting both to true will result in a focus list which is restricted to only the children of the `currentElement`.
  By default the focus list comprises of the entire document.

  `loop` instructs the functions to either cycle to the beginning of the list after reaching the end, or not.
  `nullOnExit` will then determine whether, after the end of the list is reached, the function spits out the terminal element or null. This is useful if you want special behaviour on keyboard controls reaching the end of a list. (Note, this is ignored when `loop` is true).

  For example, calling `getNextFocusable(someRef.current, true, true, false)` will return the next focusable element (what you would normally expect 'Tab' to focus on) within the scope of `someRef.current`, and `getPreviousFocusable(someRef.current, true, false, false, false)` will return the previous focusable element (what you would normally expect 'Shift + Tab' to focus on) in the entire document, with the caveat that if focus happens to already be on the first focusable element in the document it will not loop to the end, instead returning the first element in the list (the element currently focused).

### getFirstFocusable/getLastFocusable(container)
 These functions will return the first or last element in the "focus list" described above respectively for some `container` element, which is analogous to the `currentElement` above.
