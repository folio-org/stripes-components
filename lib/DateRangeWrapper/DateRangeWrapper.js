import PropTypes from 'prop-types';

const ISOFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

const propTypes = {
  children: PropTypes.func.isRequired,
  endExcluder: PropTypes.func,
  endValueGetter: PropTypes.func.isRequired,
  startExcluder: PropTypes.func,
  startValueGetter: PropTypes.func.isRequired,
};

const DateRangeWrapper = ({
  startExcluder,
  endExcluder,
  startValueGetter,
  endValueGetter,
  children,
}) => {
  const endDateExclude = (day) => {
    // day.isBefore returns `true` when `startDate` is undefined
    // but works as expected when null
    const isExcluded = endExcluder(day, startValueGetter() || null);
    return isExcluded;
  };

  const startDateExclude = (day) => {
    const isExcluded = startExcluder(day, endValueGetter() || null);
    return isExcluded;
  };

  return children({
    endDateExclude,
    startDateExclude,
  });
};

DateRangeWrapper.propTypes = propTypes;

DateRangeWrapper.defaultProps = {
  endExcluder: (day, startDate) => day.isBefore(startDate, ISOFormat),
  startExcluder: (day, endDate) => day.isAfter(endDate, ISOFormat),
};

export default DateRangeWrapper;
