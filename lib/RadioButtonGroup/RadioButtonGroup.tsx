// @ts-nocheck
import React from "react";
import formField from "../FormField";
import parseMeta from "../FormField/parseMeta";
import css from "./RadioButtonGroup.css";
type RadioButtonGroupProps = {
  children: React.ReactNode;
  error?: string | React.ReactNode;
  label?: string | React.ReactNode;
  onBlur?: (...args: any[]) => any;
  onChange?: (...args: any[]) => any;
  onFocus?: (...args: any[]) => any;
  value?: boolean | string;
  warning?: string | React.ReactNode;
};

function RadioButtonGroup(props: RadioButtonGroupProps) {
  const { error, label, onBlur, onChange, onFocus, value, warning, ...rest } =
    props;

  const displayedChildren = React.Children.map(props.children, (child) => {
    if (value !== undefined) {
      return React.cloneElement(child, {
        checked: value.toString() === child.props.value,
        marginBottom0: true,
        onBlur,
        onChange,
        onFocus,
      });
    } else {
      return child;
    }
  });

  const warningElement = warning ? (
    <div className={css.groupWarning}>{warning}</div>
  ) : null;
  const errorElement = error ? (
    <div className={css.groupError}>{error}</div>
  ) : null;

  return (
    <fieldset className={css.groupRoot} {...rest}>
      <legend className={css.groupLabel}>{label}</legend>
      {displayedChildren}
      <div role="alert">
        {warningElement}
        {errorElement}
      </div>
    </fieldset>
  );
}

export default formField(RadioButtonGroup, ({ meta }) => ({
  error: meta.touched && meta.error ? meta.error : "",
  warning: meta.touched ? parseMeta(meta, "warning") : "",
}));
