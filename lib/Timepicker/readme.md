# Timepicker
Form element for selecting a time.
## Usage
```
import Timepicker from '@folio/stripes-components/lib/Timepicker';

// later in your JSX....
<Timepicker />
```
## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`id` | string | Sets the `id` html attribute on the control | |
`label` | string | If provided, will render a `<label>` tag with an `htmlFor` attribute directed at the provided `id` prop. | | 
`rounded` | bool | Sets the 'rounded' style for the input (rounded corners via border-radius) | | 
`value` | string | Sets the value for the control. **Not necessary if using redux-form.** | | 
`onChange` | function | Callback function that will recieve the control's current value and the onChange event object. `fn(e, value)` **Not necessary if using redux-form,** but it will still work if callback from a change is needed.

## Usage in Redux-form
Redux form will provide `input` and `meta` props to the component when its used with a redux-form `<Field>` component. The component's value and validation are supplied through these.
```
<Field name="exampleTimeReturned" label="Time returned" id="timeReturnTP" placeholder="Select Time" component={Timepicker} />

```