import React from 'react';
import { useFormState } from 'react-final-form';
import PropTypes from 'prop-types';

const ISOFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

const propTypes = {
  children: PropTypes.func.isRequired,
  endExcluder: PropTypes.func,
  startExcluder: PropTypes.func,
};

const DateRangeWrapper = ({
  startExcluder,
  endExcluder,
  children,
}) => {
  const { values } = useFormState();

  const endDateExclude = (day) => {
    // day.isBefore returns `true` when `values.startDate` is undefined
    // but works as expected when null
    const isExcluded = endExcluder(day, values.startDate || null);
    return isExcluded;
  };

  const startDateExclude = (day) => {
    const isExcluded = startExcluder(day, values.endDate || null);
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
