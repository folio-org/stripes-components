import parseCSSUnit from '../../util/parseCSSUnit';

// convert CSS value to pixels, percents releative to a passed width value.
export default function convertToPixels(amount, width) {
  let convertedAmount;
  const parsedAmount = parseFloat(amount, 10);
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
