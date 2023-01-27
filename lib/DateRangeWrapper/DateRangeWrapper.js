import { useFormState } from 'react-final-form';
import PropTypes from 'prop-types';

const ISOFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

const propTypes = {
  children: PropTypes.func.isRequired,
  endExcluder: PropTypes.func,
  endValueGetter: PropTypes.func,
  startExcluder: PropTypes.func,
  startValueGetter: PropTypes.func,
};

const DateRangeWrapper = ({
  startExcluder,
  endExcluder,
  startValueGetter,
  endValueGetter,
  children,
}) => {
  const { values } = useFormState();

  const endDateExclude = (day) => {
    // day.isBefore returns `true` when `values.startDate` is undefined
    // but works as expected when null
    const isExcluded = endExcluder(day, startValueGetter(values) || null);
    return isExcluded;
  };

  const startDateExclude = (day) => {
    const isExcluded = startExcluder(day, endValueGetter(values) || null);
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
  startValueGetter: (values) => values.startDate,
  endValueGetter: (values) => values.endDate,
};

export default DateRangeWrapper;
