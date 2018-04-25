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
`onChange` | function | Callback function that will receive the control's current value and the onChange event object. `fn(e, value)` **Not necessary if using redux-form**, but it will still work if callback from a change is needed.
`passThroughValue` | string | Can be used to set dynamic values up to the form - values should be inspected/adjusted in a handler at submission time (like a button click that calls `submit()`.) See below for usage example. |  |
`autoFocus` | bool | If this prop is `true`, control will automatically focus on mount | | 

## Usage in Redux-form
Redux form will provide `input` and `meta` props to the component when it is used with a redux-form `<Field>` component. The component's value and validation are supplied through these.
```
<Field name="exampleTimeReturned" label="Time returned" id="timeReturnTP" placeholder="Select Time" component={Timepicker} />

```
## Passthrough value
Using the prop `passThroughValue` means that you expect a non-time string to be passed as a value, and want to use that to derive the time value that you do want submitted. An example of this would be to pass through "Now" and actually submit the current time (whenever the submit button is pressed.) "Now" can be set as an initial value, or the user can enter "Now".
```
<Field name="exampleTimeReturned" label="Time returned" id="timeReturnTP" placeholder="Select Time" component={Timepicker} passThroughValue="Now"/>
```
