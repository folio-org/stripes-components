# Checkbox
Renders a basic HTML checkbox.

## Usage
```js
<Checkbox
  label="My Checkbox"
  checked={true}
  value="bananas"
  onChange={(event) => {
    // consume event.target.value
  }}
/>
```

## Usage with external label
The Checkbox component automatically renders a `<label>` when a `label`-prop is present but it is also possible to render it with an external label – as long as you provide a `htmlFor`-attribute for the label that matches the ID of the `<Checkbox>`.

```js
  import { Checkbox, Label } from '@folio/stripes/components';

  <fieldset>
    <Label for="my-external-label">My external label</Label>
    <Checkbox id="my-external-label" inline />
  </fieldset>
```

## Properties

Name | type | description | default
--- | --- | --- | ---
autoFocus | bool | If this prop is `true`, will automatically focus on mount | `false`
checked | bool | Marks the checkbox as checked (true) or unchecked (false) | `false`
className | string | Adds a custom class on the root element | `undefined`
labelInfo | node | Renders labelInfo in the checkbox label | `undefined`
labelInfoClass | string | Adds a custom class name on the labelInfo element | `undefined`
disabled | bool | Sets the checkbox as disabled | `false`
error | string, node | Renders an error message below the checkbox | `undefined`
fullWidth | bool | Styles input to a width of 100% of its container | `false`
id | string | HTML id attribute applied to input - will also set the HtmlFor attribute of the `<label>`-element if a label-prop is set | autogenerated
inline | bool | Renders the checkbox inline | `false`
innerClass | string | Adds a custom class name for the inner element of the component | `undefined`
inputRef | object or func | Supplies a ref to the rendered `<input>` | `undefined`
label | string, node | Renders a label for the checkbox | `undefined`
labelClass | string | Adds a custom class name on the `<label>`-element | `undefined`
name | string | Sets the name of the input | `undefined`
onBlur | func | Event handler for the input's `onBlur` event | `undefined`
onChange | func | Event handler for the input's `onChange` event | `undefined`
onFocus | func | Event handler for the input's `onFocus` event | `undefined`
readOnly | bool | Renders the field as "read only" (focusable but non-interactive) | `false`
required | bool | Sets the field as required | `false`
value | string | Sets the selected value for the input | `undefined`
vertical | bool | Renders the label vertically (above the checkbox) | `false`
warning | string, node | Renders a warning message below the checkbox | `undefined`


## Use with React Final Form
```js
  import { Field } from 'react-final-form';
  import { Checkbox } from '@folio/stripes/components';

  <Field
    component={Checkbox}
    type="checkbox"
    name="bananas"
    label="Bananas are green?"
  />
```
(When invoking a `<Checkbox>` as part of a react-final-form `<Field>`, it is necessary to explicitly pass `type="checkbox"` as well as `component={Checkbox}`, otherwise the form library does not understand how to interpret the value.)
