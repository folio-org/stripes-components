import React from 'react';
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

export default React.memo(MonthSelect);
