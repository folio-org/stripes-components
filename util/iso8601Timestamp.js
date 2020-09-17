/**
 * Take a date-string formatted like
 *     2020-03-24T17:59:57.369+0000
 * or
 *     2020-03-24T17:59:57.369-0000
 * and reformat it like
 *     2020-03-24T17:59:57.369+00:00
 *
 * Leave other input values alone (numbers, objects, non-conforming strings).
 *
 * A more careful implementation would use a gnarly regular expression to
 * be more certain about the format of the input string. Such an impl
 * would also be waaaaaay slower.
 *
 * ISO-8601 is ambiguous about how timezones in timestamps should be formatted.
 * Regrettably, not all browsers accept all formats, leading to formatting
 * errors in some browsers, notably Safari and many browsers on mobile platforms,
 * when the timezone lacks a colon (:) between the hour and minute.
 *
 * @param value any
 * @param any, but given a string, a more-strictly compliant ISO-8601 date-time string
 */
export default function iso8601Timestamp(value) {
  let tweakedValue = value;

  if (typeof value === 'string') {
    // yeah, yeah, magic numbers. sorry.
    // 28 === length of a string like 2020-03-24T17:59:57.369-0000
    // 23 === position of + or - indicating the timezone offset
    // 26 === the first 26 chars, i.e. substring upto the timezone hours
    // 26-28 === the last 2 chars, i.e. substring including only the timezone minutes
    if (value.length === 28 && (value[23] === '+' || value[23] === '-')) {
      tweakedValue = value.substring(0, 26) + ':' + value.substring(26, 28);
    }
  }

  return tweakedValue;
}
