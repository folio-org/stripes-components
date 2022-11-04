import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

export function getLibraryLocalizedFormat(intl) {
  dayjs.locale(intl.locale);
  const format = dayjs.localeData()._longDateFormat.L;
  return format;
}

// Returns a localized format.
// Format will be a string similar to YYYY.MM.DD - something that can be
// passed to dayjs for parsing/formatting purposes.
export const getLocaleDateFormat = ({ intl }) => {
  const tempDate = new Date('Thu May 14 2020 14:39:25 GMT-0500');
  let format = '';

  // set up a locally formatted array of parts...
  if (Intl?.DateTimeFormat()?.formatToParts) {
    const intlFormatter = new Intl.DateTimeFormat(intl.locale, {
      day: '2-digit',
      year: 'numeric',
      month: '2-digit',
    });

    const formatted = intlFormatter.formatToParts(tempDate);

    // pull the localized format from the array of formatted parts.

    formatted.forEach((p) => {
      switch (p.type) {
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
          format += p.value;
          break;
        default:
          break;
      }
    });
  } else {
    // if INTL api is not available, fall back to the date library...
    format = getLibraryLocalizedFormat(intl);
  }

  return format;
};

// getLocalizedTimeFormatInfo() -
// Accepts a locale like 'ar' or 'de'
// Gets an array of dayPeriods for 12 hour modes of time. The
// array items can be used as values for the day period control,
// and the array length used to determin 12 hour (2 items) or 24 hour mode (0 items).

// example usage:
// getLocalizedTimeFormatInfo('en-SE') returns:
//   {
//     separator: ':',
//     timeFormat: 'HH:mm',
//     dayPeriods: [],  // no dayPeriods means 24 hour time format.
//   }

// getLocalizedTimeFormatInfo('en-US') returns:
//   {
//     separator: ':',
//     timeFormat: 'hh:mm A',
//     dayPeriods: ['am', 'pm'], // day periods: 12 hour time format.
//   }

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
        switch (p.type) {
          case 'hour':
            timeFormat += 'HH';
            break;
          case 'minute':
            timeFormat += 'mm';
            break;
          case 'literal':
            timeFormat += p.value;
            if (p.value !== ' ' && !formatInfo.separator) {
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
