// averages a 3rd quartile width among cell samples and compares with header to derive
// column widths.

export function calculateColumnWidth3q( // eslint-disable import/prefer-default-export
  widthCache,
  headerCache,
  columnName,
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
  if (possibleWidth < headerWidth) {
    resWidth = headerWidth + 22;
  } else {
    resWidth = possibleWidth + 22;
  }
  // console.log(`${c}: ${resWidth}`);
  return resWidth;
}
