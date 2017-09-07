# FocusLink
Component that allows directing of focus for keyboard navigation via a rendered link or other component.

## Controlling Focus
Proper focus control is very import for keyboard navigation. If this aspect of UX is untouched, keyboard users can find themselves trapped in lengthy lists of tabbable content. `<FocusLink>` helps this by providing a way for developers to add a tabbable link at the start of their list so that the user can skip it if they would like to. Another use is skipping lengthy sets of controls that may or may not be necessary for the user to focus.

## Usage
`<FocusLink>` can be passed a `ref` to a DOM element as the `target` prop's value.
[How to use/obtain refs](https://facebook.github.io/react/docs/refs-and-the-dom.html)
```
<FocusLink target={thingToFocus}>Focus on target</FocusLink>
```
To make a listing component 'skippable', use `<FocusLink>` with a `ref` to the component's outer element supplied to the `targetNextAfter` prop.
```
<div ref={(ref) = {this.container = ref;}}>
  <FocusLink targetNextAfter={this.container}>Skip this list</FocusLink>
  {/* rest of lengthy list component... */}
</div>
```
## Properties
Name | type | description | default | required
--- | --- | --- | --- | ---
target | `ref` | Reference to DOM element that should be focused when link is activated. | |
targetNextAfter | `ref` | If FocusLink is used in a list of inputs, pass a ref to the list component's outer element. When activated, focus will pass to the next focusable DOM element. | |
showOnFocus | bool | If true, `<FocusLink>` will be hidden from view until it is focused via tab-order. Good for adding accessibilty controls without cluttering up the UI.| false |
component | string | Used to render something besides an `<a>`, e.g. 'div' or 'span'. | |
