# Timepicker
Form element for selecting a time.
## Usage
```
import { Timepicker } from '@folio/stripes/components';

// later in your JSX....
<Timepicker />
```
## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`id` | string | Sets the `id` html attribute on the control | |
`label` | string | If provided, will render a `<label>` tag with an `htmlFor` attribute directed at the provided `id` prop. | |
`value` | string | Sets the value for the control. **Not necessary if using redux-form.** | |
`onChange` | function | Callback function that will receive the control's current value and the onChange event object. `fn(e, value)` **Not necessary if using redux-form**, but it will still work if callback from a change is needed. |  |
`placement` | string | Determines the position of the date picker overlay. See available options in the <a href="https://github.com/folio-org/stripes-components/tree/master/lib/Popper" target="_blank">Popper documentation</a>. | bottom | false
`modifiers` | object | Passes modifiers for the internal <a href="https://github.com/folio-org/stripes-components/tree/master/lib/Popper" target="_blank">Popper</a>-component which handles the positioning of the date picker overlay. | | false
`passThroughValue` (deprecated) | string | Can be used to set dynamic values up to the form - values should be inspected/adjusted in a handler at submission time (like a button click that calls `submit()`.) See below for usage example. |  |
`autoFocus` | bool | If this prop is `true`, control will automatically focus on mount | |
`timeZone` | string | Overrides the time zone provided by context. (Use `'UTC'` to force interpretation as an absolute time of day) | | false
`locale` | string | Overrides the locale provided by context. | "en" | false
`marginBottom0` | bool | Remove the bottom margin | false | false

## Working with Times

Using a `value` that does not include any timezone information, the
time is assumed by `moment()` to be in the local timezone. When the
local timezone is east of UTC, such as `+03:00`, and converted to UTC
for internationalization formatting, the offset will be subtracted
from the time. For example, a value of `12:00` will appear as `9:00`
UTC when viewed in the EEST timezone.

When comparing or manipulating dates, it is safest to operate in UTC
mode and leave display formatting to internationalization helpers. If
using moment, this can be done via
[`moment.utc()`](http://momentjs.com/docs/#/parsing/utc/).

## Usage in Redux-form
Redux form will provide `input` and `meta` props to the component when it is used with a redux-form `<Field>` component. The component's value and validation are supplied through these.
```
<Field name="exampleTimeReturned" label="Time returned" id="timeReturnTP" placeholder="Select Time" component={Timepicker} />
