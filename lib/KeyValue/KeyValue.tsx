// @ts-nocheck
import React from "react";
import { pickBy } from "lodash";

import NoValue from "../NoValue";
import css from "./KeyValue.css";
type KeyValueProps = {
  children?: React.ReactNode;
  label?: React.ReactNode;
  subValue?: React.ReactNode[] | React.ReactNode;
  value?: React.ReactNode[] | React.ReactNode;
};

function KeyValue({
  children,
  label,
  value,
  subValue,
  ...rest
}: KeyValueProps) {
  // pull any data-test-* props into a spreadable object
  const dataProps = pickBy(rest, (_, key) => /^data-test/.test(key));
  const displayValue = value == null || value === "" ? <NoValue /> : value;

  return (
    <div className={css.kvRoot} {...dataProps}>
      <div className={css.kvLabel}>{label}</div>
      <div className={css.kvValue} data-test-kv-value>
        {children || displayValue}
      </div>
      {subValue && (
        <em data-test-kv-sub-value className={css.kvSub}>
          {subValue}
        </em>
      )}
    </div>
  );
}

export default KeyValue;
