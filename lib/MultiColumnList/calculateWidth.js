
import parseCSSUnit from '../../util/parseCSSUnit';

// convert CSS value to pixels, percents releative to a passed width value.
export function convertToPixels(amount, width) {
  let convertedAmount;
  const parsedAmount = parseInt(amount, 10);
  switch (parseCSSUnit(amount)) {
    case 'percent':
    case 'vw':
      convertedAmount = parsedAmount * 0.01 * width;
      break;
    case 'px':
      convertedAmount = parsedAmount;
      break;
    case 'em':
    case 'rem':
      // system rem of 14
      convertedAmount = parsedAmount * 14;
      break;
    default:
      convertedAmount = parsedAmount;
  }
  return convertedAmount;
}

// averages a 3rd quartile width among cell samples and compares with header to derive
// column widths.
export function calculateColumnWidth3q(
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
  const sorted = extracted.sort((a, b) => a - b);
  // if delta between shortest and longest non-zero is small, use the longest.
  let shortestLength = sorted.find((n) => n > 0);
  if (!shortestLength) {
    shortestLength = 0;
  }
  let possibleWidth;
  if (sorted[sorted.length - 1] - shortestLength < 80) {
    possibleWidth = sorted[sorted.length - 1];
  } else {
    // otherwise, use the 3rd quartile value.
    const q3Index = Math.floor(sorted.length * 0.75);
    possibleWidth = sorted[q3Index];
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
