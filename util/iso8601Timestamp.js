/**
* Take a date-string formatted like
*     2020-03-24T17:59:57.369+0000
* and reformat it like
*     2020-03-24T17:59:57.369+00:00
 * A more careful implementation would use a gnarly regular expression to
 * be more certain about the format of the input string. such an impl
 * would also be waaaaaay slower.
 *
 * @param value string
 */
export default function iso8601Timestamp(value) {
  let tweakedValue = value;
  if (value.indexOf('+') === 23 && value.length === 28) {
    tweakedValue = value.substring(0, 26) + ':' + value.substring(26, 28);
  }

  return tweakedValue;
}
