# NumberField

Input field for parsing numeric strings in any locale ("1,234.56", "1.234,56") into JS numbers (1234.56), i.e. `atof`.

## Basic Usage
```js
import { NumberField } from '@folio/stripes/components';

<NumberField
  name="amount"
  label={<FormattedMessage id="ui-users.charge.amount.label" />}
  field={Field}
  id="amount"
  fullWidth
  required
>
```

## Summary

Detail: Convert a numeric string in any locale to a JS float, i.e. `atof` for all you C programmers. In a Javascript number, the comma `,` is used for grouping, the decimal `.` for separating the whole and decimal portion of floating point numbers, and the numerals consist of 0-9. These values are the same in the `en-US` locale but are not shared by all locales, e.g. `de-DE` which uses `.` for grouping and `,` for decimal; of course, other locales may not use Arabic numerals. This component allows users to enter numeric strings in the format expected by their current locale and have them be correctly parsed into actual JS numbers.
