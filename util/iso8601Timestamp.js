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
    // it looks ugly, but this regex just does a match for strings like
    // 2020-03-24T17:59:57.369+0000, i.e. YYYY-MM-DDTHH:MM:SS.mmm+HHMM
    if (value.match(/^[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}\.[\d]{3}[+-][\d]{4}$/)) {
      tweakedValue = value.substring(0, 26) + ':' + value.substring(26, 28);
    }
  }

  return tweakedValue;
}
