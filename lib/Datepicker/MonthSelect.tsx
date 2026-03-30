// @ts-nocheck
import React from "react";
import css from "./Calendar.css";
type MonthSelectProps = {
  inputRef?: Record<string, any>;
  month?: number;
  months?: string[];
};

const MonthSelect = ({
  inputRef,
  month,
  months,
  ...restProps
}: MonthSelectProps) => (
  <select
    data-test-month-select
    value={month}
    ref={inputRef}
    className={css.monthSelect}
    {...restProps}
  >
    {months.map((m, i) => (
      <option key={i} value={i}>
        {m}
      </option>
    ))}
  </select>
);

export default React.memo(MonthSelect);
