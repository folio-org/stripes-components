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
The Checkbox component automatically renders a `<label>` when a `label`-prop is present but it is also possible to render it with an external label – as long as you remember to provide a `for`-attribute for the label that matches the ID of the Checkbox.

```js
<fieldset>
  <Label for="my-external-label">My external label</Label>
  <Checkbox id="my-external-label" inline />
</fieldset>
```

## Properties

Name | type | description | default | required
--- | --- | --- | --- | ---
autoFocus | bool | If this prop is `true`, will automatically focus on mount | `false` | false
checked | bool | | | false
className | string | | | false
disabled | bool | | | false
error | string | | | false
fullWidth | bool | Styles input to a width of 100% of its container. | | false
hover | bool | | | false
id | string | HTML id attribute applied to input - will also set the HtmlFor attribute of the `<label>`-element if a label-prop is set. |  | false
inline | bool | Renders the checkbox inline | | false
label | string | Renders a label for the checkbox | | false
labelClass | string | | | false
labelStyle | string | | | false
marginBottom0 | bool | Styles the input with no bottom margin. | false | false
name | string | | | false
onBlur | func | | | false
onChange | func | Event handler for the input's `onChange` event. | | false
onFocus | func | | | false
readOnly | bool | Renders the field as "read only" | | false
required | bool | Sets the field as required | | false
value | string | Sets the selected value for the input. | | false
vertical | bool | Renders the label vertically (above the checkbox) | | false
warning | string | | | false


## Use with Redux Form
```
import { Checkbox } from '@folio/stripes/components';

...

  <Field
    component={Checkbox}
    label="green"
    name="bananas"
    type="radio"
    value="green"
  />

  <Field
    component={Checkbox}
    label="ripe"
    name="bananas"
    type="radio"
    value="ripe"
  />
```