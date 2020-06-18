# FormattedUTCDate

Displays a date only -- with no time component -- in UTC.

## Usage

When you would normally use `react-intl`'s `<FormattedDate>` to display a date field interpreted according to the local timezone, `<FormattedUTCDate>` can instead be used to render it interpreted as UTC -- i.e., showing precisely what is actually stored in the back-end. This is appropriate when recording only a date without an associated time, eg a birthdate. For this, UTC is used both for storage and display, so that the displayed date does not vary when crossing timezones.

## Props

The same as those of [`react-intl`'s `<FormattedDate>`](https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formatteddate).

