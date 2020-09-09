/**
 * Take a date-string formatted like
 *     2020-03-24T17:59:57.369+0000
 * or
 *     2020-03-24T17:59:57.369-0000
 * and reformat it like
 *     2020-03-24T17:59:57.369+00:00
 *
 * ISO-8601 is ambiguous about how timezones in timestamps shoudl be formatted.
 * Regrettably, not all browsers accept all formats, leading to formatting
 * errors in some browsers, notably Safari and many browsers on mobild platforms,
 * when the timezone lacks a colon (:) between the hour and minute.
 *
 * A more careful implementation would use a gnarly regular expression to
 * be more certain about the format of the input string. Such an impl
 * would also be waaaaaay slower.
 *
 * @param value string
 * @param string a more-strictly compliant ISO-8601 date-time string
 */
export default function iso8601Timestamp(value) {
  let tweakedValue = value;
  if (value.length === 28 && (value[23] === '+' || value[23] === '-')) {
    tweakedValue = value.substring(0, 26) + ':' + value.substring(26, 28);
  }

  return tweakedValue;
}
