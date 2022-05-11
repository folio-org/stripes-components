// Gets an array of dayPeriods for 12 hour modes of time. The
// array items can be used as values for the day period control,
// and the array length used to determin 12 hour (2 items) or 24 hour mode (0 items).

export default function getTimeFormatInfo(locale) {
  // Build array of time stamps for convenience.
  const dateArray = [];
  while (dateArray.length < 24) {
    dateArray.push(new Date(2022, 3, 10, dateArray.length));
  }

  const formatInfo = {};

  const options = { hour: 'numeric', minute: 'numeric' };
  const dpOptions = new Set();
  const df = new Intl.DateTimeFormat(locale, options);
  dateArray.forEach((d) => {
    const dateFields = df.formatToParts(d);

    dateFields.forEach((f) => {
      switch (f.type) {
        case 'dayPeriod':
          dpOptions.add(f.value);
          break;
        case 'literal':
          if (!formatInfo.separator) {
            formatInfo.separator = f.value;
          }
          break;
        default:
          break;
      }
    });
  });
  return {
    ...formatInfo,
    dayPeriods: [...dpOptions]
  };
}
