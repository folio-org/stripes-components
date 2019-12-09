# TextField
Text input component with label and validation controls.

## Common Usage with a form framework...
Form state frameworks such as `react-final-form` provide `<Field>` components that manage form state. `<Field>` components often automatically apply particular props such as `onChange` and `value` under the hood, so you don't have to.
```
import { TextField } from '@folio/stripes/components';
import { Field } from 'react-final-form';
...
<Field name="username" component={TextField} />
```

## Basic vanilla usage (controlled)
If used without a form state manager, you will have to supply your own state and handlers.
```
import { TextField } from '@folio/stripes/components';
...
<TextField
  label="Username"
  value={this.state.username}
  onChange={this.handleChange}
/>
```

## Basic Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`ariaLabel` | string | Applies an `aria-label` attribute - prefer visible `label` prop. Use only if the labeling case warrants. | |
`ariaLabelledBy` | string | Applies an `aria-labelledBy` attribute to the `<input>` - prefer visible `label` prop. Use only as the labeling case may warrant. | |
`autoComplete` | string | Applies `on`|`off` value. 
`autoFocus` | bool | If this prop is `true`, control will automatically focus on mount | |
`clearFieldId` | string | Id to apply to clear field button. | | 
`disabled` | bool | Disables the TextField. | |
`endControl` | element | Element to render as a tail-end control to the textfield. | |
`hasClearIcon` | bool | If `true` and value is defined, `<TextField>` will render a button for easy clearing of its value. | `true` |
`id` | string | Sets the `id` html attribute on the control | | 
`inputRef` | object or func | Supplies a ref to the rendered `<input>` | | 
`label` | string | If provided, will render a `<label>` tag with an `htmlFor` attribute directed at the provided `id` prop (an id is generated if not available.) | |
`name` | string | `name` attribute of input | | 
`placeholder` | string | `placeholder` attribute of the input. Appears as gray assistive text if no value is present. | |
`readOnly` | bool | Apply `readonly` attribute to `<input>` | | 
`required` | bool | Apply `required` attribute to `<input>` | | 
`startControl` | element |  Element to render as a leading control to the textfield. | | 
`type` | string | Type attribute of `<input>` | "text" | 
`value` | string or number | Sets the value for the control. | |

## Callback Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`onBlur` | func | Listener for `onBlur` event. | | 
`onChange` | func | Callback fired when input value is changed. | | 
`onClearField` | func | Callback when input is cleared using the `clearIcon` control | | 
`onFocus` | func | Callback fired when input is focused | | 

## Validation Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`dirty` | bool | Mark 'true' when value has changes. | |
`error` | node | Error string to display after textfield in case of validation error. | |
`loading` | bool | Applies a loading animation - useful for async validation or loading search results. | |
`valid` | bool | Applies success validation style to `<input>` | | 
`validStylesEnabled` | bool | When set to false, `<input>` will not display validation styles. | `true` | 
`warning` | node | Validation warning. Renders node below textfield with warning styling. | | 

## Style Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`className` | string | Apply a custom class name to the root element. | | 
`focusedClass` | string | CSS class to apply on input element's focus event. | | 
`fullWidth` | bool | If `true` `<TextField>` will fill its container. | |
`inputClass` | string | Custom CSS class to apply to the input | | 
`inputStyle` | object | Applies an inline style to the `<input>` | | 
`marginBottom0` | bool | Remove bottom margin of styling. | | 
`noBorder` | bool | Renders `<input>` borderless. | | 

## Accessible Labeling
Text inputs should always have an appropriate label so that will be announced through screen-readers when the TextField is focused. This can be accomplished in a few different ways:
### Label prop
The most common use case for form labeling.
```
<TextField label="Username" />
```
### AriaLabel prop
If the design case requires a **visually hidden label**
```
<TextField ariaLabel="Username" />
```

### AriaLabelledBy prop
If the label is designed visible, but needs to exist outside of `<TextField>`'s root element.
```
<div id="myLabel">Username</div>
<TextField ariaLabelledBy="myLabel" />
```

## Focus Management
Requirements may call for programmatic focus of `<TextField>`'s `<input>`.
```
this.input = React.createRef();
...
// function to call in order to focus the input.
focusBarcode() {
    if (this.input.current) {
        this.input.current.focus();
    }
}
...
<TextField label="barcode" inputRef={this.input} />
```
