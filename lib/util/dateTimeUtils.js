import moment from 'moment-timezone';
import dayjs from 'dayjs';
import noop from 'lodash/noop';
import timezone from 'dayjs/plugin/timezone';
import localeData from 'dayjs/plugin/localeData';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import arraySupport from 'dayjs/plugin/arraySupport';
import objectSupport from 'dayjs/plugin/objectSupport';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import availableLocales from 'dayjs/locale'

dayjs.extend(timezone);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(objectSupport);
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(arraySupport);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

// export a pre-extended dayjs for consumption.
export { dayjs };

const DEFAULT_LOCALE = 'en-US';

/** DayJS range utility class. */
export class DayRange {
  /**
     * Create a DayRange.
     * @param {DayJS|dateString} start - the start value.
     * @param {DayJS|dateString} end - the end value.
     */
  constructor(start, end) {
    this.start = dayjs(start);
    this.end = dayjs(end);
    this.isRange = true;
  }

  /**
   * returns an array of contained dayjs day objects.
   *
   * @method
   * @name DayRange#asDayJSArray
   * @returns {Array} of dayjs objects.
   */
  asDayJSArray = () => {
    const range = [];
    let current = dayjs(this.start);
    while (current.isBefore(this.end)) {
      range.push(current.clone());
      current = current.add(1, 'day');
    }
    return range;
  };

  /**
   * equality check.
   *
   * @method
   * @name DayRange#isSame
   * @param { DayRange }
   * @returns {Bool}
   */
  isSame = (candidate) => {
    return this.start.isSame(candidate.start, 'day') && this.end.isSame(candidate.end, 'day');
  };

  /**
   * returns true if candidate is fully within or equal to the range. Can be used with single dayjs objects
   * or date strings as well.
   *
   * @method
   * @name DayRange#contains
   * @param { DayRange|Dayjs }
   * @returns {Bool}
   */
  contains = (candidate) => {
    if (candidate instanceof DayRange) {
      return this.isSame(candidate) ||
      (this.contains(candidate.start) && this.contains(candidate.end));
    } else {
      return dayjs(candidate).isBetween(this.start, this.end);
    }
  };

  /**
   * returns true if candidate start or end is within the range, or if candidate is equal to the range.
   *
   * @method
   * @name DayRange#overlaps
   * @param { DayRange|Dayjs }
   * @returns {Bool}
   */
  overlaps = (candidate) => {
    if (candidate instanceof DayRange) {
      return this.isSame(candidate) ||
      this.contains(candidate.start) ||
      this.contains(candidate.end);
    } else {
      throw new Error('parameter should be a DayRange instance');
    }
  };
}

/**
 * Since Moment is still in use, we can keep this for sake of easing the transition.
 * @deprecated
 *
 * @export
 * @param {*} intl
 * @returns {String}
 */
export function getMomentLocalizedFormat(intl) {
  moment.locale(intl.locale);
  const format = moment.localeData()._longDateFormat.L;
  return format;
}

/**
 * getDayJSLocalizedFormat
 * Fallback function in case getLocaleDateFormat is unable to perform.
 *
 * @export
 * @param {*} intl
 * @returns {String}
 */
export const getDayJSLocalizedFormat = (intl) => {
  dayjs.locale(intl.locale);
  return dayjs.localeData().longDateFormat('L');
};

/** dateCanBeParsed
 *  Due to some differentiating behavior between passing a single formats vs an array of formats to Dayjs.utc,
 *  we're implementing this utility function...
 *  We can probably remove this once https://github.com/iamkun/dayjs/pull/1914 is merged...
 *
 * @export
 * @param {String} value - the date string to be validated.
 * @param {Array.<String>} formats - an array of formats to attempt parsing the value with. The first to
 *  parse successfully will be returned as the validFormat.
 * @returns {String}
*/
export const dateCanBeParsed = (value, formats) => ({
  isValid: formats.some((f) => dayjs.utc(value, f).isValid()),
  validFormat: formats[formats.findIndex((f) => dayjs(value, f, true).isValid())]
});



/**
 * getCompatibleDayJSLocale -
 * Function that returns an existing DayJS locale. Returns undefined if the static locale does not exist.
 *
 * @param {String} locale  - locale string ex : 'en-SE'
 * @param {String} parentLocale - 2 character language of the locale...ex parentLocale of
 */
export const getCompatibleDayJSLocale = (locale, parentLanguage) => {
  /**
     * Check for availability of locales - DayJS comes with a JSON list of available locales.
     * We can check against that before attempting to load. We check for the full locale
     * first, followed by the language if the full locale doesn't work.
     */
  let localeToLoad;
  let available = availableLocales.findIndex(l => l.key === locale);
  if (available !== -1) {
    localeToLoad = locale;
  } else {
    available = availableLocales.findIndex(l => l.key === parentLanguage);
    if (available !== -1) {
      localeToLoad = parentLanguage;
    } else {
      // eslint-disable-next-line no-console
      console.error(`${locale}/${parentLanguage} unavailable for DayJS`);
    }
  }
  return localeToLoad;
};

/**
 * loadDayJSLocale
 * dynamically loads a DayJS locale and sets the global DayJS locale.
 * @param {string} locale
 * */
export function loadDayJSLocale(locale, cb = noop) {
  const parentLocale = locale.split('-')[0];
  // Locale loading setup for DayJS
  // 'en-US' is default and always loaded, so we don't even worry about loading another if the language is English.
  if (locale !== DEFAULT_LOCALE) {
    const localeToLoad = getCompatibleDayJSLocale(locale, parentLocale);

    if (localeToLoad) {
      import(
        /* webpackChunkName: "dayjs-locale-[request]" */
        /* webpackExclude: /\.d\.ts$/ */
        `dayjs/locale/${localeToLoad}`
      ).then(() => {
        dayjs.locale(localeToLoad);
        cb(localeToLoad);
      }).catch(e => {
        // eslint-disable-next-line no-console
        console.error(`Error loading locale ${localeToLoad} for DayJS`, e);
        cb(localeToLoad, e);
      });
    } else {
      // fall back to english in case a compatible locale can't be loaded.
      dayjs.locale(DEFAULT_LOCALE);
      cb(DEFAULT_LOCALE);
    }
  } else {
    // set locale to english in case we're transitioning away from a non-english locale.
    dayjs.locale(DEFAULT_LOCALE);
    cb(DEFAULT_LOCALE);
  }
}

/**
 * Returns a localized format.
 * Format will be a string similar to YYYY.MM.DD - something that can be
 * passed to moment/dayjs for parsing/formatting purposes.
 * @export
 * @param {Object} settings -
 * @param {Object} settings.intl - the intl object from context
 * @param {config} settings.config - sets the options for IntlDateTimeFormat. See
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
 * @returns {String} - something similar to 'YYYY-MM-DD' or 'MM/DD/YYYY' that you could provide to a date-parsing library.
 */

export const getLocaleDateFormat = ({ intl, config }) => {
  const tempDate = new Date('Thu May 14 2020 14:39:25 GMT-0500');
  let format = '';

  // set up a locally formatted array of parts...
  if (Intl?.DateTimeFormat()?.formatToParts) {
    const intlFormatter = new Intl.DateTimeFormat(intl.locale, config || {
      day: '2-digit',
      year: 'numeric',
      month: '2-digit',
    });

    const formatted = intlFormatter.formatToParts(tempDate);

    // pull the localized format from the array of formatted parts.

    formatted.forEach((p) => {
      switch (p.type) {
        case 'dayPeriod':
          format += 'A';
          format = format.replace('H', 'h');
          break;
        case 'minute':
          format += 'mm';
          break;
        case 'hour':
          format += 'H';
          break;
        case 'month':
          format += 'MM';
          break;
        case 'day':
          format += 'DD';
          break;
        case 'year':
          format += 'YYYY';
          break;
        case 'literal':
          // An ICU 72 update places a unicode character \u202f (non-breaking space) before day period (am/pm).
          // This can make for differences that are imperceptible to humans, but automated tests know!
          // the \u202f character is best detected via its charCode... 8239
          if (p.value.charCodeAt(0) === 8239) {
            format += ' ';
          } else {
            format += p.value;
          }
          break;
        default:
          break;
      }
    });
  } else {
    // if INTL api is not available, fall back to moment...
    format = getMomentLocalizedFormat(intl);
  }

  return format;
};

/**
 * getLocalizedTimeFormatInfo()
 * Accepts a locale like 'ar' or 'de'
 * Gets an array of dayPeriods for 12 hour modes of time. The
 * array items can be used as values for the day period control,
 * and the array length used to determin 12 hour (2 items) or 24 hour mode (0 items).
 *
 * example usage:
 * getLocalizedTimeFormatInfo('en-SE') returns:
 *   {
 *     separator: ':',
 *     timeFormat: 'HH:mm',
 *     dayPeriods: [],  // no dayPeriods means 24 hour time format.
 *   }
 *
 * getLocalizedTimeFormatInfo('en-US') returns:
 *   {
 *     separator: ':',
 *     timeFormat: 'hh:mm A',
 *     dayPeriods: ['am', 'pm'], // day periods: 12 hour time format.
 *   }
 *
 * @export
 * @param {*} locale
 * @returns {{ timeFormat: string; dayPeriods: {}; }}
 */
export function getLocalizedTimeFormatInfo(locale) {
  // Build array of time stamps for convenience.
  const dateArray = [];
  while (dateArray.length < 24) {
    dateArray.push(new Date(2022, 3, 10, dateArray.length));
  }

  const formatInfo = {};

  const options = { hour: 'numeric', minute: 'numeric' };
  const dpOptions = new Set();
  const df = new Intl.DateTimeFormat(locale, options);

  let timeFormat = '';
  dateArray.forEach((d, i) => {
    const dateFields = df.formatToParts(d);

    dateFields.forEach((f) => {
      if (f.type === 'dayPeriod') {
        dpOptions.add(f.value);
      }
    });

    // compile a local date-time format from the pieces of the last item.
    // something in the form of HH:mm or HH:mm A that could be fed to a library like moment.
    if (i === dateArray.length - 1) {
      dateFields.forEach((p) => {
        let adjustedValue;
        switch (p.type) {
          case 'hour':
            timeFormat += 'HH';
            break;
          case 'minute':
            timeFormat += 'mm';
            break;
          case 'literal':
            adjustedValue = p.value;
            // An ICU 72 update places a unicode character \u202f (non-breaking space) before day period (am/pm).
            // This can make for differences that are imperceptible to humans, but automated tests know!
            // the \u202f character is best detected via its charCode... 8239
            if (adjustedValue.charCodeAt(0) === 8239) {
              adjustedValue = ' ';
            }
            timeFormat += adjustedValue;
            if (adjustedValue !== ' ' && !formatInfo.separator) {
              formatInfo.separator = p.value;
            }
            break;
          case 'dayPeriod':
            timeFormat += 'A';
            break;
          default:
            break;
        }
      });
    }
  });

  if (timeFormat.includes('A')) {
    timeFormat = timeFormat.replace('HH', 'hh');
  }

  return {
    ...formatInfo,
    timeFormat,
    dayPeriods: [...dpOptions],
  };
}

/** Parses time without DST.
 * DST moves time forward an hour - so +1 to the utc offset - but thankfully, it's not in use for majority ranges.
 * given 2 static sample dates that are far enough apart, you'd get one that wasn't
 * in DST if it's observed in your locale.
 * so we can use the non-DST date to avoid off-by-1-hour time issues.
 *
 * @export
 * @param {String} dateTime
 * @param {String} timeFormat
 * @returns {String}
*/
export function removeDST(dateTime, timeFormat) {
  const julDate = '2022-07-20';
  const janDate = '2022-01-01';

  const julOffset = moment(julDate).utcOffset();
  const janOffset = moment(janDate).utcOffset();

  const offsetDate = janOffset < julOffset ? janDate : julDate;
  const timestring = dateTime.includes('T') ? dateTime.split('T')[1] : dateTime;
  return moment.utc(`${offsetDate}T${timestring}`).local().format(timeFormat);
}

/**
 * Version of removeDST using DayJS
 *
 * @export
 * @param {String} dateTime
 * @param {String} timeFormat
 * @returns {String}
 */
export function removeDSTDayJS(dateTime, timeFormat) {
  const julDate = '2022-07-20';
  const janDate = '2022-01-01';

  const julOffset = dayjs(julDate).utcOffset();
  const janOffset = dayjs(janDate).utcOffset();

  const offsetDate = janOffset < julOffset ? janDate : julDate;
  const timestring = dateTime.includes('T') ? dateTime.split('T')[1] : dateTime;
  return dayjs.utc(`${offsetDate}T${timestring}`).local().format(timeFormat);
}
