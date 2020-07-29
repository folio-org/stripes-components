import React from 'react';
import PropTypes from 'prop-types';
import css from './Calendar.css';

const MonthSelect = ({
  inputRef,
  month,
  months,
  ...restProps
}) => (
  <select
    data-test-month-select
    value={month}
    ref={inputRef}
    className={css.monthSelect}
    {...restProps}
  >
    {months.map((m, i) => (
      <option key={i} value={i}>{m}</option>
    ))}
  </select>
);

MonthSelect.propTypes = {
  inputRef: PropTypes.object,
  month: PropTypes.number,
  months: PropTypes.arrayOf(PropTypes.string),
};
export default React.memo(MonthSelect);
