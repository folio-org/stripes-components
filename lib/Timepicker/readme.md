# Timepicker
## Usage

```js
import { Timepicker } from '@folio/stripes/components';
//..
<Timepicker />
//or pass as component within a final-form...
<Field component={Timepicker} />
```

## Controlled Timepicker example
```
...
const [time, updatetime] = useState();
...

handleTimeChange = (e) => {
  updatetime(e.target.value);
}

<Timepicker
  label="Time"
  value={this.state.time1}
  onChange={handleTimeChange}
/>
```

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`autoFocus` | bool | If this prop is `true`, component will automatically focus on mount | |
`disabled` | bool | if true, field will be disabled for focus or entry. | false | false
`id` | string | id for date field - used in the "id" attribute of the text input | | false
`label` | string | visible field label | | false
`locale` | string | Overrides the locale provided by context. | | false
`marginBottom0` | bool | removes the default bottom margin from the component. | | false
`modifiers` | object | Passes modifiers for the internal <a href="https://github.com/folio-org/stripes-components/tree/master/lib/Popper" target="_blank">Popper</a>-component which handles the positioning of the time picker overlay. | | false
`onChange` | func | Event handler to handle updates to the value. By default this value comes from a hidden input, containing a formatted output value (product of `outputFormatter`) | | false
`outputFormatter` | func | Function to format the date value for submission to the backend. | `defaultOutputFormatter` |
`parser` | func | Function to format the time from the `value` prop to the value ui's presentation within the visible input. | `defaultParser` |
`placement` | string | Determines the position of the time picker overlay. See available options in the <a href="https://github.com/folio-org/stripes-components/tree/master/lib/Popper" target="_blank">Popper documentation</a>. | 'bottom' | false
`readOnly` | bool | if true, field will be readonly. 'Calendar' and 'clear' buttons will be omitted. | false | false
`required` | bool | markes the input as a required field, applies the html required attribute. | | false
`screenReaderMessage` | string | Additional message to be read by screenreaders when textfield is focused in addition to the label and format - which are always read. | | false
`timeZone` | string | Overrides the time zone provided by context. | "UTC" | false
`timeFormat` | string | String to override default time format according to locale | | false
`useInput` | bool | If true - Outputs the value as it is displayed in the input. | false |
`usePortal` | bool | if true, the Timepicker will render itself to a React-Portal (the `#OverlayContainer` div) this avoids haveing the Timepicker cutoff by overflow. Given the container of this component, `usePortal` may not be required. See [portals documentation](https://folio-org.github.io/stripes-components/iframe.html?viewMode=docs&id=guides-ui-layout--docs#portals) for guidance. | false | false
`value` | string | time to be displayed in the visible input. | | false


## `parser` and `outputFormatter` - Timepicker Value Flow.

The value flow happens in 3 stages
1. **value prop** - the value prop is a time string. ex '4:00 AM' or '13:00'.

2. **presentation formatting** - the value prop is localized via the function from the `parser` prop and displayed in the text input. This function is provided with the following parameters in this order:
- `value` - the value prop.
- `timezone` - the timezone prop.
- `timeFormat` - array of localized formats including the value provided in the `timeFormat` prop.
- `intl` - from the `intl` prop or part of `react-intl` context.

By default this returns a localized time value DST removed, or the raw input value (if it doesn't satisfy the full time format 'H:mm' or 'h:mm A').

3. **output formatting** - when the input is changed by the user, its value is formatted again to work with the backend/data layer using the `outputFormatter` function. This function is provided *a parameter object* holding the following keys:
- `value` - the value prop.
- `formats` - the array of localized formats including the  `timeFormat` prop if provided for displaying the value in the textfield.
- `timezone` - string representing the timezone, taken from context or via the override prop.
- `intl` - from the intl prop or part of `react-intl` context.

By default, this function returns a value in the ISOString format: 'HH:mm:ss.sssZ'


## Final Form usage

```
<Field component={Timepicker} name="time" label="time" />
```
### Value manipulation into/out of the field...
To adjust the value from the redux store before passing it to the component, use the `<Field>`'s `format` prop:
```
const formatField = value => (value ? moment.utc(value) : '');
<Field component={Timepicker} name="date" label="date" format={formatField} />
```
To adjust the set value, prior to storing it in the redux-store, use `parse`
```
const parseField = value => (value ? moment.utc(value) : '');
<Field component={Timepicker} name="date" label="date" parse={parseField} />
```
