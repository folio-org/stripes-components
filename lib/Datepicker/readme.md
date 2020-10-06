# Datepicker
## Usage

```js
import { Datepicker } from '@folio/stripes/components';
//..
<Datepicker />
//or pass as component within a form...
<Field component={Datepicker} />
```
outputBackendValue: PropTypes.bool,
  outputFormatter: PropTypes.func,
  parser: PropTypes.func,

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`autoFocus` | bool | If this prop is `true`, component will automatically focus on mount | |
`backendDateStandard` | string | parses to/from ISO 8601 standard by default before committing value. | "ISO 8601" | false
`disabled` | bool | if true, field will be disabled for focus or entry. | false | false
`id` | string | id for date field - used in the "id" attribute of the text input | | false
`label` | string | visible field label | | false
`locale` | string | Overrides the locale provided by context. | "en" | false
`onChange` | func | Event handler to handle updates to the datefield text. | | false
`outputBackendValue` | bool | If False - Outputs the value as it is displayed in the input. | true |
`outputFormatter` | func | Function to format the date value for submission to the backend. | `defaultOutputFormatter` | 
`parser` | func | Function to format the date from the `value` prop to the value ui's presentation within the input. | `defaultParser` | 
`placement` | string | Determines the position of the date picker overlay. See available options in the <a href="https://github.com/folio-org/stripes-components/tree/master/lib/Popper" target="_blank">Popper documentation</a>. | bottom | false
`modifiers` | object | Passes modifiers for the internal <a href="https://github.com/folio-org/stripes-components/tree/master/lib/Popper" target="_blank">Popper</a>-component which handles the positioning of the date picker overlay. | | false
`readOnly` | bool | if true, field will be readonly. 'Calendar' and 'clear' buttons will be omitted. | false | false
`screenReaderMessage` | string | Additional message to be read by screenreaders when textfield is focused in addition to the label and format - which are always read. | | false
`timeZone` | string | Overrides the time zone provided by context. | "UTC" | false
`useFocus` | bool | if set to false, component relies solely on clicking the calendar icon to toggle appearance of calendar. | true | false
`usePortal` | bool | if true, the Datepicker will render itself to a React-Portal (the `#OverlayContainer` div) this avoids haveing the Datepicker cutoff by overflow. | false | false
`value` | string | date to be displayed in the textfield. In forms, this is supplied by the initialValues prop supplied to the form | "" | false

<!-- dateFormat | string | system formatting for date. [Moment.js formats](https://momentjs.com/docs/#/displaying/format/) are supported | "MM/DD/YYYY" | false-->

## Controlled Datepicker example
```
...
state = {
  day1: 11/03/1980
}
...

handleDateChange = (e) => {
  const newDate = e.target.value;
  this.setState({
    day1: newDate,
  });
}

<Datepicker
  label="Date"
  value={this.state.day1}
  onChange={handleDateChange}
/>
```

## Redux-form/Final Form usage

```
<Field component={Datepicker} name="date" label="date" />
```
### Value manipulation into/out of the field...
To adjust the value from the redux store before passing it to the component, use the `<Field>`'s `format` prop:
```
const formatField = value => (value ? moment.utc(value) : '');
<Field component={Datepicker} name="date" label="date" format={formatField} />
```
To adjust the set value, prior to storing it in the redux-store, use `parse`
```
const parseField = value => (value ? moment.utc(value) : '');
<Field component={Datepicker} name="date" label="date" parse={parseField} />
```
You can read more about value lifecycles in `redux-form` here: https://redux-form.com/7.4.2/docs/valuelifecycle.md/

## Working with Dates

Using a `value` that does not include any time or timezone
information, such as `12/01`, the date is assumed by `moment()` to be
in the local timezone. When the local timezone is east of UTC, such as
`+03:00`, and converted to UTC for internationalization formatting,
the offset will be subtracted from the date. So `12/01` will appear as
`11/30` in timezones east of UTC.

When comparing or manipulating dates, it is safest to operate in UTC
mode and leave display formatting to internationalization helpers. If
using moment, this can be done via
[`moment.utc()`](http://momentjs.com/docs/#/parsing/utc/).

## Datepicker value flow.

The value flow happens in 3 stages
1. value prop - the value prop is a date string. ex `1992-04-29
2. presentation formatting - the value prop is localized via the function from the `parser` prop and displayed in the text input. This function is provided with the following parameters:
- value - the value prop.
- timeZone - the timezone prop.
- uiFormat - the localized format or `dateFormat` prop.
- outputFormat - the ISO-string literal format derived from the `backendDateStandard` prop
3. output formatting - when the input is changed by the user, its value is formatted again to work with the backend using the `outputFormatter` function. This function is provided with **a parameter object** holding the following values:
- backendDateStandard - the prop of the same name. 
- value - the value prop.
- uiFormat - the localized format or `dateFormat` prop for displaying in the textfield.
- outputFormat - the ISO-string literal format derived from the `backendDateStandard` prop.
- timeZone - the timezone prop.

## Features
### Keyboard Navigation
* **Up arrow** - Move cursor up in the calendar (backwards 1 week)
* **Down arrow** - Move cursor down in the calendar (forwards 1 week)
* **Left arrow** - Move cursor left 1 day in the calendar (backwards 1 day)
* **Right arrow** - Move cursor right 1 day in the calendar (forwards 1 day)
* **Enter** - Select date at cursor
* **Esc** - Close calendar

## Custom Circumstances with RFF

If the provided defaults and base behaviors don't quite cover your requirements, you may need write an additional function in order to wrap the datepicker and modify props from `<Field>`. Simply supplying a function that accepts the input, and meta props that components usually receive from RFF. In this example, we want validation errors to 
to show only if there are no warnings. Note the passing of a `useInput` prop to Datepicker. This is typically and internal prop for Datepicker to know when it's being used within a `<Field>` and act accordingly - otherwise, you may see date output coming through in the incorrect format.

```
<Field
  name={`${name}.startDate`}
  validate={composeValidators(
    validators.requiredStartDate,
    validators.dateOrder,
    multipleOpenEndedCoverages,
    overlappingCoverages,
  )}
>
  {({ input, meta }) => {
    return (
      <Datepicker
        backendDateStandard="YYYY-MM-DD"
        error={!meta?.data?.warning && meta.touched && meta.error}
        id={`cc-start-date-${index}`}
        input={input}
        inputRef={this.inputRef}
        label={<FormattedMessage id="ui-agreements.agreements.startDate" />}
        parser={parseDateOnlyString}
        useInput  /* supremely important */
        required
        usePortal
        warning={meta.touched && input.value && meta?.data?.warning}
      />
    );
  }}
</Field>
```