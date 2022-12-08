# RadioButton
Renders a basic HTML radio button.

## Usage

```
<RadioButton
  checked={true}
  value="bananas"
  onChange={(event) => {
    // consume event.target.value
  }}
/>
```

## Properties

Name | type | description | default | required
--- | --- | --- | --- | ---
autoFocus | bool | If this prop is `true`, will automatically focus on mount | `false` | false
centered | bool | Allow to center radio button | `false` | false
checked | bool | | | false
className | string | | | false
disabled | bool | | | false
error | string | | | false
fullWidth | bool | Styles input to a width of 100% of its container. | | false
hover | bool | | | false
id | string | HTML id attribute applied to input - will also set the HtmlFor attribute of the label. |  | false
inline | bool | | | false
label | string | Adds an html `<label>` tag container a string to the element. | | false
labelClass | string | | | false
labelStyle | string | | | false
marginBottom0 | bool | Styles the input with no bottom margin. | false | false
name | string | | | false
onBlur | func | | | false
onChange | func | Event handler for the input's `onChange` event. **This prop isn't necessary if part of a redux-form (see below)** | | false
onFocus | func | | | false
readOnly | bool | Renders the field as "read only" | | false
required | bool | Sets the field as required | | false
value | string | Sets the selected value for the input. **This prop isn't necessary if part of a redux-form (see below)** | | false
warning | string | | | false  


## Use with Redux Form
```
import { RadioButton } from '@folio/stripes/components';

...

  <Field
    component={RadioButton}
    label="green"
    name="bananas"
    type="radio"
    value="green"
  />

  <Field
    component={RadioButton}
    label="ripe"
    name="bananas"
    type="radio"
    value="ripe"
  />
```
(When invoking a `<RadioButton>` as part of a react-final-form `<Field>`, it is necessary to explicitly pass `type="radio"` as well as `component={RadioButton}`, otherwise the form library does not understand how to interpret the value.)

[`<RadioButtonGroup>`](../RadioButtonGroup) makes working with Redux Form easier.
