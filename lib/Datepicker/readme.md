# Datepicker
### Usage

```js
import Datepicker from '@folio/stripes-components/lib/Datepicker';
//..
<Datepicker />
//or pass as component within a form...
<Field component={Datepicker} />
```

### Props
Name | type | description | default | required
--- | --- | --- | --- | ---
label | string | visible field label | | false
backendDateStandard | string | parses to/from ISO 8601 standard by default before committing value. | "ISO 8601" | false 
id | string | id for date field - used in the "id" attribute of the text input | | false
useFocus | bool | if set to false, component relies solely on clicking the calendar icon to toggle appearance of calendar. | true | false
disabled | bool | if true, field will be disabled for focus or entry. | false | false
readOnly | bool | if true, field will be readonly. 'Calendar' and 'clear' buttons will be omitted. | false | false
value | string | date to be displayed in the textfield. In forms, this is supplied by the initialValues prop supplied to the form | "" | false
onChange | func | Event handler to handle updates to the datefield text. | | false
screenReaderMessage | string | Additional message to be read by screenreaders when textfield is focused in addition to the label and format - which are always read. | | false
excludeDates | array, string or Moment object | Disables supplied dates from being selected in the calendar. | | false
<!-- locale | string | locale for datepicker to use to display calendar. e.g. "de" will display calendar using the German locale | "en" | false -->
<!-- dateFormat | string | system formatting for date. [Moment.js formats](https://momentjs.com/docs/#/displaying/format/) are supported | "MM/DD/YYYY" | false-->


### Features
#### Keyboard Navigation
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
