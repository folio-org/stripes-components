# Select
Renders a basic HTMLSelect field.

## Usage

```
<Select
  dataOptions={[
    {value: "Y", label: "Yes"},
    {value: "N", label: "No"},
    {value: "M", label: "Maybe", disabled: true}
   ]}
/>
```

## Properties

Name | type | description | default | required
--- | --- | --- | --- | ---
label | string | Adds an html `<label>` tag container a string to the element. | | false
id | string | HTML id attribute applied to input - will also set the HtmlFor attribute of the label. |  | false
dataOptions | array | Array of objects for options in the shape of `{value:<string>, label: <string>, disabled:<bool>}` |  | required
autoFocus | bool | If this prop is `true`, `<select>` will automatically focus on mount | `false` | false
placeholder | string | Sets a disabled first option in the options list. |  | false
multiple | bool | Sets the multiple attribute on the select field. | false | false
required | bool | Sets the required attribute on the select field. | false | false
readOnly | bool | Sets the select field as read only. | false | false
marginBottom0 | bool | Styles the input with no bottom margin. | false | false
fullWidth | bool | Styles input to a width of 100% of its container. | | false
validationEnabled | bool | Controls whether or not the select displays validation icons. | true | false
value | string | Sets the selected value for the input. **This prop isn't necessary if part of a redux-form (see below)** | | false
onChange | func | Event handler for the select's `onChange` event. **This prop isn't necessary if part of a redux-form (see below)** | | false
selectClass | string | Adds className to the select field | | false

## Properties set by Redux-form
If `<Select>` is used within a redux-form `<Field>` component (currently the most common case) then you don't have to set any of these props yourself. See the [redux-form website](https://redux-form.com/7.2.0/) for more details.

* value - Sets the selected value for the input.
* input - object - contains necessary props for the input itself such as the field's `value`
* meta - object - contains good-to-have info for the field such as `touched`

## Usage with Redux-form's `<Field>` component
In Short, `<Field>` requires a `name` and a `component` prop. The `name` is the data field and the `component` prop takes the `<Select>`. Additional props supplied are passed into the rendered `<Select>` component.
See the [redux-form website](https://redux-form.com/7.2.0/) for more information.

```
import { Select } from '@folio/stripes/components';

...

<Field
  name="country2"
  id="countrySelect2"
  component={Select}
  fullWidth
  dataOptions={[
    {value: "Yes", label: "Y"},
    {value: "No", label: "N", disabled: true}
  ]}
/>
```
