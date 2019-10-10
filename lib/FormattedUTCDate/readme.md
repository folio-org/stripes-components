# FormattedUTCDate

Displays an data only -- with no time component -- in UTC.

## Usage

When you would normally use `react-intl`'s `<FormattedDate>` to display a date-time field in the local timezone, `<FormattedUTCDate>` can instead be used to render the date part only. In such cases, UTC is used both for storage and display, so that the displayed date does not vary when crossing timezones.

## Props

The same as those of [`react-intl`'s `<FormattedDate>`](https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formatteddate).

