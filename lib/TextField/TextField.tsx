// @ts-nocheck
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import uniqueId from "lodash/uniqueId";
import classNames from "classnames";

import formField from "../FormField";
import Label from "../Label";
import nativeChangeField from "../../util/nativeChangeFieldValue";
import TextFieldIcon from "./TextFieldIcon";
import css from "./TextField.css";
import formStyles from "../sharedStyles/form.css";
import sharedInputStylesHelper from "../sharedStyles/sharedInputStylesHelper";
import omitProps from "../../util/omitProps";
import parseMeta from "../FormField/parseMeta";
type TextFieldProps = {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  autoCapitalize?: string;
  autoComplete?: string;
  autoCorrect?: string;
  autoFocus?: boolean;
  className?: string;
  clearFieldId?: string;
  dirty?: boolean;
  disabled?: boolean;
  endControl?: React.ReactElement;
  error?: React.ReactNode;
  focusedClass?: string;
  fullWidth?: boolean;
  hasClearIcon?: boolean;
  id?: string;
  inputClass?: string;
  inputRef?: Record<string, any> | ((...args: any[]) => any);
  inputStyle?: string;
  label?: React.ReactNode;
  loading?: boolean;
  marginBottom0?: boolean;
  name?: string;
  noBorder?: boolean;
  onBlur?: (...args: any[]) => any;
  onChange?: (...args: any[]) => any;
  onClearField?: (...args: any[]) => any;
  onFocus?: (...args: any[]) => any;
  readOnly?: boolean;
  required?: boolean;
  spellCheck?: boolean;
  startControl?: React.ReactElement;
  type?: string;
  valid?: boolean;
  validationEnabled?: boolean;
  validStylesEnabled?: boolean;
  value?: string | number;
  warning?: React.ReactNode;
};

class TextField extends Component<TextFieldProps> {
  static defaultProps = {
    hasClearIcon: true,
    type: "text",
    validationEnabled: true,
    autoComplete: "off",
    autoCorrect: "off",
    autoCapitalize: "off",
    spellCheck: false,
    value: "",
  };

  constructor(props) {
    super(props);

    this.startControl = React.createRef();
    this.endControl = React.createRef();

    this.clearField = this.clearField.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      focused: false,
      prevPropsValue: props.value, // eslint-disable-line react/no-unused-state
      value: props.value,
    };

    // typecheck for ref callbacks...
    if (typeof this.props.inputRef === "function") {
      this.input = (ref) => {
        props.inputRef(ref);
        this.input.current = ref;
      };
    } else {
      this.input = props.inputRef || React.createRef();
    }

    // if no id has been supplied, generate a unique one
    if (Object.prototype.hasOwnProperty.call(props, "id")) {
      this.testId = props.id;
    } else {
      this.testId = uniqueId("text-input-");
    }
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    if (props.disabled && state.focused) {
      newState.focused = false;
    }

    if (props.value !== state.prevPropsValue) {
      newState.prevPropsValue = props.value;
      newState.value = props.value;
    }

    if (Object.keys(newState).length > 0) {
      return newState;
    }
    return null;
  }

  componentWillUnmount() {
    if (this.resetFocusTO) {
      clearTimeout(this.resetFocusTO);
      this.resetFocusTO = null;
    }
  }

  getInputStyle() {
    let classStringFromProps;
    if (/\s/.test(this.props.inputStyle)) {
      const tempClasses = this.props.inputStyle.split(/\s+/);
      const csslist = [];
      tempClasses.forEach((classname) => csslist.push(`${css[classname]}`));
      classStringFromProps = csslist.join(" ");
    }

    return classNames(
      classStringFromProps,
      sharedInputStylesHelper(this.props),
    );
  }

  onFocus = (event) => {
    const { onFocus } = this.props;

    if (!this.state.focused) {
      this.setState({
        focused: true,
      });

      if (typeof onFocus === "function") {
        onFocus(event);
      }
    }
  };

  onBlur = (event) => {
    const { onBlur } = this.props;
    const { currentTarget, relatedTarget } = event;

    if (!(relatedTarget && currentTarget.contains(relatedTarget))) {
      // delay focus stay setting for a whole tick. This is intended to keep the clear button around long enough for its
      // click event to fire on iOS devices.
      this.resetFocusTO = setTimeout(() => {
        this.setState({
          focused: false,
        });
      });

      if (typeof onBlur === "function") {
        onBlur(event);
      }
    }
  };

  clearField() {
    const { onClearField } = this.props;

    // Fire callback
    if (typeof onClearField === "function") {
      onClearField();
    }

    // Clear value on input natively, dispatch an event to be picked up by handleChange, and focus on input again
    if (this.input.current) {
      nativeChangeField(this.input, true, "");
      if (this.state.value !== "") {
        this.setState({ value: "" });
      }
    }
  }

  handleChange(event) {
    const { onChange } = this.props;
    this.setState({
      value: event.target.value,
    });

    // Fire callback
    if (typeof onChange === "function") {
      onChange(event);
    }
  }

  render() {
    const {
      clearFieldId,
      endControl,
      label,
      name,
      required,
      readOnly,
      startControl,
      validationEnabled,
    } = this.props;

    // Use omitProps here instead of separateComponentProps because
    // redux-form needs the abililty to directly manage the props it passes
    // down to the fields it manages. separateComponentProps requires us to
    // know the names of all the props we want to pass along, but we don't
    // know them.
    // this still feels kinda clumsy, but at least it's not broken.
    const inputCustom = omitProps(this.props, [
      "ariaLabel",
      "ariaLabelledBy",
      "clearFieldId",
      "dirty",
      "endControl",
      "focusedClass",
      "fullWidth",
      "hasClearIcon",
      "inputClass",
      "inputRef",
      "label",
      "loading",
      "marginBottom0",
      "noBorder",
      "onClearField",
      "onFocus",
      "required",
      "startControl",
      "valid",
      "validationEnabled",
      "validStylesEnabled",
    ]);

    const component = (
      <input
        {...inputCustom}
        aria-label={inputCustom["aria-label"] || this.props.ariaLabel}
        aria-labelledby={
          inputCustom["aria-labelledby"] || this.props.ariaLabelledBy
        }
        aria-required={inputCustom["aria-required"] || required}
        aria-invalid={inputCustom["aria-invalid"] || !!this.props.error}
        autoComplete={this.props.autoComplete}
        autoFocus={this.props.autoFocus}
        autoCorrect={this.props.autoCorrect}
        autoCapitalize={this.props.autoCapitalize}
        spellCheck={this.props.spellCheck}
        id={this.testId}
        name={name}
        onChange={this.handleChange}
        ref={this.input}
        required={required}
        value={this.state.value}
        className={this.props.inputClass}
      />
    );

    let validation = null;
    let clearField = null;
    let startControlElement;
    let endControlElement;

    if (
      this.props.hasClearIcon &&
      !this.props.loading &&
      this.state.focused &&
      this.state.value
    ) {
      clearField = (
        <FormattedMessage id="stripes-components.clearThisField">
          {([ariaLabel]) => (
            <TextFieldIcon
              aria-label={ariaLabel}
              icon="times-circle-solid"
              id={clearFieldId || `clickable-${this.testId}-clear-field`}
              onClick={this.clearField}
              tabIndex="-1"
            />
          )}
        </FormattedMessage>
      );
    }

    // If validStylesEnabled is enabled we add some styling if the field is valid
    // This is disabled by default because it's primarily used when something is
    // getting validated on the server - e.g. checking for an email or similar.
    if (
      this.props.validStylesEnabled &&
      validationEnabled &&
      this.props.valid
    ) {
      validation = (
        <FormattedMessage id="stripes-components.fieldIsValid">
          {([ariaLabel]) => (
            <TextFieldIcon
              aria-label={ariaLabel}
              icon="check-circle"
              iconClassName={css.successIcon}
              id={`icon-${this.testId}-validation-success`}
            />
          )}
        </FormattedMessage>
      );
    }

    if (validationEnabled && this.props.error) {
      validation = (
        <FormattedMessage id="stripes-components.fieldHasError">
          {([ariaLabel]) => (
            <TextFieldIcon
              aria-label={ariaLabel}
              icon="exclamation-circle"
              iconClassName={css.errorIcon}
              id={`icon-${this.testId}-validation-error`}
            />
          )}
        </FormattedMessage>
      );
    }

    if (this.props.loading) {
      validation = (
        <FormattedMessage id="stripes-components.validatingInProcess">
          {([ariaLabel]) => (
            <TextFieldIcon
              aria-label={ariaLabel}
              icon="spinner-ellipsis"
              iconClassName={css.loadingIcon}
              iconSize="small"
            />
          )}
        </FormattedMessage>
      );
    }

    if ((!readOnly && clearField) || validation || endControl) {
      endControlElement = (
        <div className={css.endControls}>
          <div className={css.controlGroup} ref={this.endControl}>
            {!readOnly && clearField}
            {validation}
            {endControl}
          </div>
        </div>
      );
    }

    if (startControl) {
      startControlElement = (
        <div className={css.startControls}>
          <div className={css.controlGroup} ref={this.startControl}>
            {startControl}
          </div>
        </div>
      );
    }

    const warningElement = this.props.warning ? (
      <div className={formStyles.feedbackWarning}>{this.props.warning}</div>
    ) : null;

    const errorElement = this.props.error ? (
      <div className={formStyles.feedbackError}>{this.props.error}</div>
    ) : null;

    const wrapperStyles = classNames(
      css.textField,
      {
        [this.props.focusedClass]:
          this.state.focused && this.props.focusedClass,
      },
      this.props.className,
    );

    const inputGroupStyles = classNames(this.getInputStyle(), css.inputGroup, {
      [formStyles.isDisabled]: this.props.disabled,
      [formStyles.isFocused]: this.state.focused,
    });

    return (
      <div className={wrapperStyles}>
        {label && (
          <Label htmlFor={this.testId} required={required} readOnly={readOnly}>
            {label}
          </Label>
        )}
        <div
          className={inputGroupStyles}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          {startControlElement}
          {component}
          {endControlElement}
        </div>
        <div role="alert">
          {warningElement}
          {errorElement}
        </div>
      </div>
    );
  }
}

export default formField(TextField, ({ meta }) => ({
  dirty: meta.dirty,
  error: meta.touched && meta.error ? meta.error : "",
  valid: meta.valid,
  warning: meta.touched ? parseMeta(meta, "warning") : "",
}));
