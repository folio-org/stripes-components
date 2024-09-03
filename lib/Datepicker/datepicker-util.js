import moment from 'moment-timezone';

export const getBackendDateStandard = (standard, use) => {
  if (!use) return [];
  if (standard === 'ISO8601') return ['YYYY-MM-DDTHH:mm:ss.sssZ', 'YYYY-MM-DDTHH:mm:ssZ'];
  if (standard === 'RFC2822') return ['ddd, DD MMM YYYY HH:mm:ss ZZ'];
  return [standard, 'YYYY-MM-DDTHH:mm:ss.sssZ', 'ddd, DD MMM YYYY HH:mm:ss ZZ'];
};

// Controls the formatting from the value prop to what displays in the UI.
// need to judge the breakage factor in adopting a spread syntax for these parameters...
export const defaultParser = (value, timeZone, uiFormat, outputFormats) => {
  if (!value || value === '') { return value; }

  const offsetRegex = /T[\d.:]+[+-][\d]+$/;
  const offsetRE2 = /T[\d:]+[-+][\d:]+\d{2}$/; // sans milliseconds
  let inputMoment;
  // if date string contains a utc offset, we can parse it as utc time and convert it to selected timezone.
  if (offsetRegex.test(value) || offsetRE2.test(value)) {
    inputMoment = moment.tz(value, timeZone);
  } else {
    inputMoment = moment.tz(value, [uiFormat, ...outputFormats], timeZone);
  }
  const inputValue = inputMoment.format(uiFormat);
  return inputValue;
};


// if the input isn't the same as the date output by the parser, pass it through as-is.
// this will accept partial dates through the value prop and
// render them in the input field as-is.
export const passThroughParser = (value, timeZone, uiFormat, outputFormats) => {
  const candidate = defaultParser(value, timeZone, uiFormat, outputFormats);
  if (candidate !== value) {
    // check if the value is in the backendDateStandard format. If so, return the candidate...
    const inputMoment = moment.tz(value, outputFormats, true, timeZone);
    if (inputMoment.isValid()) return candidate;
    return value
  }
  return candidate;
}

/** defaultValidator
 *  validates user input to determine whether the value is processed for output.
 *  if this function _always_ returns true, the value will always be output,
 *  leaving it up to the application to validate.
 */
export const defaultInputValidator = ({ value, format, backendStandard }) => {
  // use strict mode to check validity  - incomplete dates, anything not conforming to the format will be invalid
  const valueMoment = new moment(// eslint-disable-line new-cap
    value,
    [format, ...backendStandard], // pass array of possible formats ()
    true
  );
  return valueMoment.isValid();
}

/**
 * defaultOutputFormatter
 * Controls the formatting from the value prop/input to what is relayed in the onChange event.
 * This function has two responsibilities:
 *   1. use `backendDateStandard` to format `value`
 *   2. convert value to Arabic/Latn digits (0-9)
 *
 * The first responsibility is pretty obvious, but the second one is subtle,
 * implied but never clearly stated in API documentation. Dates are passed
 * as strings in API requests and are then interpreted by the backend as Dates.
 * To be so interpretable, they must conform to the expected formatted AND use
 * the expected numeral system.
 *
 * This function allows the format to be changed with `backendDateStandard`.
 * To change the numeral system, pass a function as `outputFormatter`, which
 * gives you control over both the format and the numeral system.
 *
 * @returns {string} 7-bit ASCII
 */
export const defaultOutputFormatter = ({ backendDateStandard, value, uiFormat, outputFormats, timeZone }) => {
  if (!value || value === '') { return value; }
  const parsed = new moment.tz(value, [uiFormat, ...outputFormats], timeZone); // eslint-disable-line

  if (/8601/.test(backendDateStandard)) {
    return parsed.toISOString();
  }

  // Use `.locale('en')` before `.format(...)` to get Arabic/"Latn" numerals.
  // otherwise, a locale like ar-SA or any locale with a "-u-nu-..." subtag
  // can give us non-Arabic (non-"Latn") numerals, and in such a locale the
  // formatter "YYYY-MM-DD" can give us output like this: ١٦‏/٠٧‏/٢٠٢١
  // i.e. we get year-month-day but in non-Arabic numerals.
  //
  // Additional details about numbering systems at
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/numberingSystem
  // and about how the locale string may be parsed at
  // https://www.rfc-editor.org/rfc/rfc5646.html

  // for support of the RFC2822 format (rare thus far and support may soon be deprecated.)
  if (/2822/.test(backendDateStandard)) {
    const DATE_RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ';
    return parsed.locale('en').format(DATE_RFC2822);
  }

  // if a localized string dateformat has been passed, normalize the date first...
  // otherwise, localized strings could be submitted to the backend.
  const normalizedDate = moment.utc(value, [uiFormat, ...outputFormats]);

  return new moment(normalizedDate, 'YYYY-MM-DD').locale('en').format(backendDateStandard); // eslint-disable-line
};

// validates potential output values against the format prop (uiFormat) prior to outputting them.
// passes invalid input (value) directly through, leaving validation up to the consuming app.
export const passThroughOutputFormatter = ({ backendDateStandard, value, uiFormat, outputFormats, timeZone }) => {
  if (!value || value === '') { return value; }
  if (defaultInputValidator(
    {
      value,
      format: uiFormat,
      backendStandard: getBackendDateStandard(backendDateStandard, true)
    }
  )) {
    return defaultOutputFormatter({ backendDateStandard, value, uiFormat, outputFormats, timeZone });
  } else {
    return value;
  }
};

export const datePickerAppValidationProps = {
  outputFormatter: passThroughOutputFormatter,
  parser: passThroughParser,
  inputValidator : () => true,
};
