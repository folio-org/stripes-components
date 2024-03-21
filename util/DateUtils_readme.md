# Date/time utilities

### Pre-extended DayJS

To reduce overhead from repeated `extend()` calls throughout the codebase, we export a single, pre-extended dayjs. [See the Code](./dateTimeUtils.js) for the list of included extensions.

FOLIO ui-modules *do not* need to add dayjs to their `package.json`.

[See DayJS documentation for DayJS usage guidance.](https://day.js.org/docs/en/parse/parse)

### DayRange Utility Class

convenience class for validating date ranges.

```
new DayRange(startDayJS, endDayJS);
```

| method | parameters | description |
|------- | ---------- | ----------- |
| isSame | candidate(DayRange) | Returns `true` if day ranges are the same (matching start and end days.) |
| contains | candidate(datestring, DayRange, DayJS) | Returns `true` if candidate is between the start and end days. |
| overlaps | candidate(DayRange) | Returns `true` if candidate DayRange overlaps with the owning DayRange. |

### Loading DayJS locales.

To reduce bundle size, DayJS does not automatically bundle all static locales. UI module code should typically *NOT* have to load DayJS locale information in UI code since this is handled by `stripes-core` when a user changes the current platform locale. It will match the locale to the appropriate DayJS locale.

```
import { loadDayJSLocale } from '@folio/stripes/components';

loadDayJSLocale(intl.locale);
or
loadDayJSLocale('ru');
or
loadDayJSLocale('en-SE');
```

In addition to this, hooks and react-based utilities are also provided.

### Locale date time format

Obtaining locale-aware date/time format information can be performed via `getLocaleDateFormat()` ex: `DD.MM.YYYY`. It should be provided the `intl` object, or an object with a `locale` key.

It defaults to return the long date format, but can be configured to return time formats as well, sharing configuration options with [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options)

```
import { getLocaleDateFormat } from '@folio/stripes/components';

const format = getLocaleDateFormat({ intl }); // returns 'MM/DD/YYYY'

const timeFormat = getLocaleDateFormat({ intl, config: { hour: "numeric",
  minute: "numeric" }}) // returns 'h:mm A'
```

