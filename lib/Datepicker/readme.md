# Datepicker
## Usage

```js
import { Datepicker } from '@folio/stripes/components';
//..
<Datepicker />
//or pass as component within a form...
<Field component={Datepicker} />
```

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`label` | string | visible field label | | false
`backendDateStandard` | string | parses to/from ISO 8601 standard by default before committing value. | "ISO 8601" | false
`id` | string | id for date field - used in the "id" attribute of the text input | | false
`useFocus` | bool | if set to false, component relies solely on clicking the calendar icon to toggle appearance of calendar. | true | false
`autoFocus` | bool | If this prop is `true`, component will automatically focus on mount | |
`disabled` | bool | if true, field will be disabled for focus or entry. | false | false
`readOnly` | bool | if true, field will be readonly. 'Calendar' and 'clear' buttons will be omitted. | false | false
`value` | string | date to be displayed in the textfield. In forms, this is supplied by the initialValues prop supplied to the form | "" | false
`onChange` | func | Event handler to handle updates to the datefield text. | | false
`screenReaderMessage` | string | Additional message to be read by screenreaders when textfield is focused in addition to the label and format - which are always read. | | false
`timeZone` | string | Overrides the time zone provided by context. | "UTC" | false
`locale` | string | Overrides the locale provided by context. | "en" | false

<!-- dateFormat | string | system formatting for date. [Moment.js formats](https://momentjs.com/docs/#/displaying/format/) are supported | "MM/DD/YYYY" | false-->

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

## Features
### Keyboard Navigation
* **Up arrow** - Move cursor up in the calendar (backwards 1 week)
* **Down arrow** - Move cursor down in the calendar (forwards 1 week)
* **Left arrow** - Move cursor left 1 day in the calendar (backwards 1 day)
* **Right arrow** - Move cursor right 1 day in the calendar (forwards 1 day)
* **PgUp** - backwards 1 month
* **PgDown** - forwards 1 month
* **Ctrl + PgUp** - backwards 1 year
* **Ctrl + PgDown** - forwards 1 year
* **Enter** - Select date at cursor
* **Esc** - Close calendar
