# NumberField

Input field for parsing strings into numbers according to the current locale.

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

Detail: In Javascript the comma `,` is used for grouping, the decimal `.` for separating whole and decimal portion of floating point numbers, and the numerals consist of 0-9. These values are the same in the `en-US` locale but are not shared by all locales, e.g. `de-DE` which uses `.` for grouping and `,` for decimal, and others may not use Arabic numerals. This component allows users to enter numberic values in their tenant's format and have them be correctly parsed into numeric values.
