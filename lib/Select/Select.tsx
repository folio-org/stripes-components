// @ts-nocheck
import React, { Component } from "react";
import classNames from "classnames";
import uniqueId from "lodash/uniqueId";

import formField from "../FormField";
import css from "./Select.css";
import formStyles from "../sharedStyles/form.css";
import sharedInputStylesHelper from "../sharedStyles/sharedInputStylesHelper";
import omitProps from "../../util/omitProps";
import parseMeta from "../FormField/parseMeta";
import Icon from "../Icon";
import Label from "../Label";
type SelectProps = {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  autoFocus?: boolean;
  children?: React.ReactNode;
  dataOptions?: Record<string, any>[];
  dirty?: boolean;
  disabled?: boolean;
  error?: React.ReactNode;
  fullWidth?: boolean;
  id?: string;
  inputRef?: Record<string, any> | ((...args: any[]) => any);
  label?: React.ReactNode;
  loading?: boolean;
  marginBottom0?: boolean;
  multiple?: boolean;
  name?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  selectClass?: string;
  valid?: boolean;
  validationEnabled?: boolean;
  validStylesEnabled?: boolean;
  value?: number | string | boolean;
  warning?: React.ReactNode;
};

class Select extends Component<SelectProps> {
  static defaultProps = {
    autoFocus: false,
    validationEnabled: true,
    validStylesEnabled: false,
    multiple: false,
  };

  constructor(props) {
    super(props);
    this.id = this.props.id || uniqueId("select-");
  }

  getRootClass() {
    return classNames(css.select, formStyles.inputGroup, {
      [`${css.fullWidth}`]: this.props.fullWidth,
    });
  }

  getSelectClass() {
    return classNames(
      css.selectControl,
      // placeholder styling
      {
        [`${css.placeholder}`]: this.props.placeholder && !this.props.value,
      }, // end placeholder
      sharedInputStylesHelper(this.props),
      this.props.selectClass,
    );
  }

  getAriaLabelledBy() {
    const label =
      (this.props.label || this.props["aria-label"]) && `${this.id}-label`;
    const readOnly = this.props.readOnly && `${this.id}-read-only-message`;

    const finalString = [label, this.props["aria-labelledby"], readOnly]
      .filter(Boolean)
      .join(" ");

    return finalString ?? undefined;
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      autoFocus,
      dataOptions,
      dirty,
      children,
      error,
      fullWidth,
      label,
      loading,
      marginBottom0,
      name,
      placeholder,
      readOnly,
      required,
      valid,
      validationEnabled,
      validStylesEnabled,
      warning,
      inputRef,
      multiple,
      ...selectCustom
    } = this.props;
    /* eslint-enable no-unused-vars */

    const options = [];

    if (this.props.placeholder) {
      options.push(
        <option value="" key="x" disabled>
          {placeholder}
        </option>,
      );
    }

    if (dataOptions) {
      dataOptions.forEach((option, i) => {
        options.push(
          <option
            value={option.value}
            key={option.id || `option-${i}`}
            disabled={
              option.disabled || (readOnly && option.value !== this.props.value)
            }
          >
            {option.label}
          </option>,
        );
      });
    }

    const component = (
      <select
        autoFocus={autoFocus}
        className={this.getSelectClass()}
        name={name}
        {...omitProps(selectCustom, [
          "selectClass",
          "aria-labelledby",
          "aria-label",
        ])}
        aria-labelledby={this.getAriaLabelledBy()}
        aria-invalid={!!this.props.error}
        aria-required={required}
        id={this.id}
        required={required}
        ref={inputRef}
        multiple={multiple}
      >
        {options}
        {React.Children.map(children, (child) => {
          if (child.type === "option") {
            return React.cloneElement(child, {
              // Disable option if it's disabled
              // or <Select> is read-only and option is different from current value
              disabled:
                child.props.disabled ||
                (readOnly && child.props.value !== this.props.value),
            });
          }

          return child;
        })}
      </select>
    );

    const errorElem = error ? (
      <div className={formStyles.feedbackError}>{error}</div>
    ) : null;

    const warningElem = warning ? (
      <div className={formStyles.feedbackWarning}>{warning}</div>
    ) : null;

    return (
      <div className={this.getRootClass()}>
        {label || this.props["aria-label"] ? (
          <Label
            htmlFor={this.id}
            id={`${this.id}-label`}
            readOnly={readOnly}
            required={required}
            className={this.props["aria-label"] && "sr-only"}
          >
            {this.props["aria-label"] || label}
          </Label>
        ) : (
          ""
        )}
        <div className={css.selectWrap}>
          {component}
          {!multiple && (
            <Icon icon="triangle-down" iconRootClass={css.selectIcon} />
          )}
        </div>
        <div role="alert">
          {warningElem}
          {errorElem}
        </div>
      </div>
    );
  }
}

export default formField(Select, ({ meta }) => ({
  dirty: meta.dirty,
  error: meta.touched && meta.error ? meta.error : "",
  valid: meta.valid,
  warning: meta.touched ? parseMeta(meta, "warning") : "",
}));
