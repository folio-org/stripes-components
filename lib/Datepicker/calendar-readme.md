# Calendar
## Usage

```js
import { Calendar } from '@folio/stripes/components';
//..
<Calendar />
```

## Props

Name | type | description | default | required
--- | --- | --- | --- | ---
`exclude` | function | Function used to exclude dates. |
`fillParent` | bool | if `true`, Calendar has full width, if `false`, Calendar will have a max-width set to 390px | `false` | 
`firstFieldRef` | ref | Used for managing focus/sending focus to month dropdown when Calendar is initially displayed | | 
`id` | string | Applies an id prop to containing element | |  
`locale`| string | An intl locale string. Uses `intl.locale` internally by default. |  | 
`onBlur`| func | Callback for when focus leaves the calendar. | |
`onFocus`| func | Callback for when focus enters the calendar. | |
`onKeyDown`| func | keyboard even handler for extra function. Check [here](#keyboard-navigation) for implemented handlers | | 
`onRequestClose` | func | If used as an overlay/dropdown, what to do when the user closes the dropdown. | |
`onSetDate` | func | Essentially, an `onChange` handler for when a day is clicked from the calendar | | 
`rootRef` | ref | Ref to the Calendar's root element. | |
`selectedDate` | string | Currently selected date. Format should match with the long date format of `intl.locale` | | 
`trapFocus` | bool | toggles trapping focus within the calendar. Focus must be controlled/trapped for best accessibility when used as an overlay/dropdown. | `true` | 

<!-- dateFormat: PropTypes.string, -->

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

### Keyboard Navigation
* **Up arrow** - Move cursor up in the calendar (backwards 1 week)
* **Down arrow** - Move cursor down in the calendar (forwards 1 week)
* **Left arrow** - Move cursor left 1 day in the calendar (backwards 1 day)
* **Right arrow** - Move cursor right 1 day in the calendar (forwards 1 day)
* **Enter** - Select date at cursor
* **Esc** - Close calendar
