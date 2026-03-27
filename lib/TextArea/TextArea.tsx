// @ts-nocheck
import React, { Component } from "react";
import className from "classnames";
import { FormattedMessage } from "react-intl";
import uniqueId from "lodash/uniqueId";
import noop from "lodash/noop";

import Label from "../Label";
import parseMeta from "../FormField/parseMeta";
import formField from "../FormField";
import TextFieldIcon from "../TextField/TextFieldIcon";
import omitProps from "../../util/omitProps";
import nativeChangeField from "../../util/nativeChangeFieldValue";
import sharedInputStylesHelper from "../sharedStyles/sharedInputStylesHelper";

import formStyles from "../sharedStyles/form.css";
import css from "./TextArea.css";
type TextAreaProps = {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  autoFocus?: boolean;
  clearFieldId?: string;
  dirty?: boolean;
  disabled?: boolean;
  endControl?: React.ReactElement;
  error?: React.ReactNode;
  fitContent?: boolean;
  fullWidth?: boolean;
  hasClearIcon?: boolean;
  id?: string;
  inputRef?: ((...args: any[]) => any) | { current?: Element };
  isCursorAtEnd?: boolean;
  label?: React.ReactNode;
  loading?: boolean;
  lockWidth?: boolean;
  marginBottom0?: boolean;
  name?: string;
  newLineOnShiftEnter?: boolean;
  noBorder?: boolean;
  onBlur?: (...args: any[]) => any;
  onChange?: (...args: any[]) => any;
  onClearField?: (...args: any[]) => any;
  onFocus?: (...args: any[]) => any;
  onKeyDown?: (...args: any[]) => any;
  onSubmitSearch?: (...args: any[]) => any;
  readOnly?: boolean;
  required?: boolean;
  rootClass?: string;
  startControl?: React.ReactElement;
  valid?: boolean;
  validationEnabled?: boolean;
  validStylesEnabled?: boolean;
  value?: string;
  warning?: React.ReactNode;
};

const RESIZE_HANDLE_WIDTH = 8;

class TextArea extends Component<TextAreaProps> {
  static defaultProps = {
    newLineOnShiftEnter: false,
    validationEnabled: true,
    validStylesEnabled: false,
    onKeyDown: noop,
    onSubmitSearch: noop,
    onBlur: noop,
    onFocus: noop,
    onClearField: noop,
    value: "",
  };

  constructor(props) {
    super(props);

    // if no id has been supplied, generate a unique one
    this.inputId = props.id ?? uniqueId("textarea-input-");

    this.state = {
      focused: false,
      prevPropsValue: props.value,
      endControlInset: 0,
      value: props.value,
    };

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { borderBoxSize } = entry;

        const dimensions = {
          width: borderBoxSize[0].inlineSize,
          height: borderBoxSize[0].blockSize,
        };

        this.moveEndContent(dimensions);
      }
    });
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    if (props.value !== state.prevPropsValue) {
      newState.prevPropsValue = props.value;
      newState.value = props.value;
    }

    if (Object.keys(newState).length > 0) {
      return newState;
    }

    return null;
  }

  containerRef = React.createRef();
  textareaRef = React.createRef();

  componentDidMount() {
    const { isCursorAtEnd } = this.props;

    if (isCursorAtEnd) {
      this.placeCursorAtEnd();
    }
  }

  placeCursorAtEnd = () => {
    const textarea = this.textareaRef.current;
    const valueLength = textarea.value.length;

    textarea.setSelectionRange(valueLength, valueLength);
  };

  moveEndContent = (dimensions) => {
    const containerWidth = this.containerRef?.current?.offsetWidth;

    const resizeDiff = dimensions.width - containerWidth;

    this.setState({ endControlInset: -(resizeDiff - RESIZE_HANDLE_WIDTH) });
  };

  setInputRef = (ref) => {
    this.textareaRef.current = ref;

    if (this.props.inputRef) {
      this.props.inputRef.current = ref;
    }

    if (ref) {
      this.resizeObserver.observe(ref);
    }
  };

  getRootStyle() {
    return className(css.textArea, this.props.rootClass, {
      [`${css.fullWidth}`]: this.props.fullWidth,
    });
  }

  getInputGroupStyle() {
    return className(formStyles.inputGroup, {
      [`${css.hasClearIcon}`]: this.props.hasClearIcon,
    });
  }

  getInputStyle() {
    const endControl = this.props.endControl ? css.hasEndControl : "";
    const startControl = this.props.startControl ? css.hasStartControl : "";

    return className(
      startControl,
      endControl,
      sharedInputStylesHelper(this.props),
      { [`${css.lockWidth}`]: this.props.lockWidth },
    );
  }

  onFocus = (event) => {
    const { onFocus } = this.props;

    if (!this.state.focused) {
      this.setState({
        focused: true,
      });

      onFocus(event);

      setTimeout(() => {
        const dimensions = {
          width: this.props.inputRef?.current?.offsetWidth,
        };
        this.moveEndContent(dimensions);
      });
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

      onBlur(event);
    }
  };

  handleChange = (event) => {
    const { onChange } = this.props;

    this.setState({
      value: event.target.value,
    });

    // Fire callback
    if (typeof onChange === "function") {
      onChange(event);
    }
  };

  handleKeyDown = (event) => {
    const { onKeyDown, onSubmitSearch, newLineOnShiftEnter } = this.props;

    if (newLineOnShiftEnter && event.key === "Enter") {
      if (!event.shiftKey) {
        onSubmitSearch(event);
      }
    }

    onKeyDown(event);
  };

  clearField = () => {
    const { onClearField } = this.props;

    if (typeof onClearField === "function") {
      onClearField();
    }

    // Clear value on input natively, dispatch an event to be picked up by handleChange, and focus on input again
    if (this.textareaRef.current) {
      nativeChangeField(this.textareaRef, true, "");
      if (this.state.value !== "") {
        this.setState({ value: "" });
      }
    }
  };

  render() {
    /* eslint-disable no-unused-vars */
    const {
      ariaLabel,
      ariaLabelledBy,
      autoFocus,
      dirty,
      endControl,
      error,
      fitContent,
      fullWidth,
      inputRef,
      label,
      loading,
      name,
      noBorder,
      readOnly,
      required,
      startControl,
      valid,
      validStylesEnabled,
      warning,
      hasClearIcon,
      clearFieldId,
      ...rest
    } = this.props;

    const inputCustom = omitProps(rest, [
      "id",
      "validationEnabled",
      "value",
      "onChange",
      "newLineOnShiftEnter",
      "onSubmitSearch",
      "lockWidth",
      "rootClass",
      "marginBottom0",
      "isCursorAtEnd",
      "onClearField",
    ]);

    const component = (
      <textarea
        aria-required={required}
        aria-invalid={!!this.props.error}
        aria-label={inputCustom["aria-label"] || ariaLabel}
        aria-labelledby={inputCustom["aria-labelledby"] || ariaLabelledBy}
        autoFocus={autoFocus}
        className={this.getInputStyle()}
        id={this.inputId}
        name={name}
        ref={this.setInputRef}
        cols={fitContent ? this.props.value.length : undefined}
        value={this.state.value}
        onChange={this.handleChange}
        required={required}
        onKeyDownCapture={this.handleKeyDown}
        {...inputCustom}
      />
    );

    let clearField = null;
    let endControlElement;

    if (hasClearIcon && !loading && this.state.focused && this.state.value) {
      clearField = (
        <FormattedMessage id="stripes-components.clearThisField">
          {([_ariaLabel]) => (
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

    if ((!readOnly && clearField) || endControl) {
      endControlElement = (
        <div
          className={css.endControls}
          style={{
            "inset-inline-end": `${this.state.endControlInset}px`,
          }}
        >
          <div className={css.controlGroup}>
            {!readOnly && clearField}
            {endControl}
          </div>
        </div>
      );
    }

    const warningElement = warning ? (
      <div className={formStyles.feedbackWarning}>{warning}</div>
    ) : null;

    const errorElement = error ? (
      <div className={formStyles.feedbackError}>{error}</div>
    ) : null;

    const labelElement = label ? (
      <Label htmlFor={this.inputId} required={required} readOnly={readOnly}>
        {label}
      </Label>
    ) : null;

    return (
      <div className={this.getRootStyle()} ref={this.containerRef}>
        {labelElement}
        <div
          className={this.getInputGroupStyle()}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          {component}
          {endControlElement}
          <div role="alert">
            {warningElement}
            {errorElement}
          </div>
        </div>
      </div>
    );
  }
}

export default formField(TextArea, ({ meta }) => ({
  dirty: meta.dirty,
  error: meta.touched && meta.error ? meta.error : "",
  valid: meta.valid,
  warning: meta.touched ? parseMeta(meta, "warning") : "",
}));
