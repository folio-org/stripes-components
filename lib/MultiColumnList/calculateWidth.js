// averages a 3rd quartile width among cell samples and compares with header to derive
// column widths.
import parseCSSUnit from '../util/parseCSSUnit';

export function calculateColumnWidth3q( // eslint-disable-line import/prefer-default-export
  widthCache,
  headerCache,
  columnName,
  extraWidth = 30,
  modifiers = {},
) {
  const localModifiers = Object.assign(
    {
      min: 0
    },
    modifiers
  );
  const extracted = [];
  for (const k in widthCache.cache) {
    if (Object.prototype.hasOwnProperty.call(widthCache.cache, k)) {
      if (widthCache.cache[k] > 0) {
        if (widthCache.cache[k] < localModifiers.min) {
          extracted.push(localModifiers.min);
        } else {
          extracted.push(widthCache.cache[k]);
        }
      }
    }
  }
  extracted.sort((a, b) => a - b);
  // if delta between shortest and longest non-zero is small, use the longest.
  const shortestLength = extracted[0] ?? 0;
  let possibleWidth;
  /* if a difference between the shortest and the longest width is less than
   * 80, use the longest value. This is best for columns with a set number of possibilities that have
   * very small difference in width... we just go ahead and prefer the longest of the two rather than
   * calculate third quartile and possibly end up with the shorter of the two. For instance, a column with
   * values rendering as 'active' and 'inactive' - we would always just want the width
   * assigned to 'inactive' if one is present.
  */
  if (extracted[extracted.length - 1] - shortestLength < 80) {
    possibleWidth = extracted[extracted.length - 1];
  } else {
    // otherwise, use the 3rd quartile value.
    const q3Index = Math.floor(extracted.length * 0.75);
    possibleWidth = extracted[q3Index];
    if (possibleWidth === 0) {
      possibleWidth = shortestLength;
    }
  }

  let resWidth;
  const headerWidth = headerCache.request(columnName);
  if (possibleWidth < (headerWidth + extraWidth)) {
    resWidth = headerWidth + extraWidth;
  } else {
    resWidth = possibleWidth + extraWidth;
  }

  if (localModifiers.max && parseCSSUnit(localModifiers.max) === 'px') {
    if (resWidth > parseInt(localModifiers.max, 10)) {
      resWidth = parseInt(localModifiers.max, 10);
    }
  }

  // console.log(`${c}: ${resWidth}`);
  return resWidth;
}
