// averages a 3rd quartile width among cell samples and compares with header to derive
// column widths.

export function calculateColumnWidth3q( // eslint-disable-line import/prefer-default-export
  widthCache,
  headerCache,
  columnName,
  extraWidth = 30,
) {
  const extracted = [];
  for (const k in widthCache.cache) {
    if (Object.prototype.hasOwnProperty.call(widthCache.cache, k)) {
      extracted.push(widthCache.cache[k]);
    }
  }
  extracted.sort((a, b) => a - b);
  // if delta between shortest and longest non-zero is small, use the longest.
  let shortestLength = extracted.find((n) => n > 0);
  if (!shortestLength) {
    shortestLength = 0;
  }
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
  // console.log(`${c}: ${resWidth}`);
  return resWidth;
}
