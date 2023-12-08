import React, { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import { FormattedMessage } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';

import Label from '../Label';
import parseMeta from '../FormField/parseMeta';
import formField from '../FormField';
import TextFieldIcon from '../TextField/TextFieldIcon';
import omitProps from '../../util/omitProps';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';

import formStyles from '../sharedStyles/form.css';
import css from './TextArea.css';

class TextArea extends Component {
  static propTypes = {
    ariaLabel: PropTypes.string,
    ariaLabelledBy: PropTypes.string,
    autoFocus: PropTypes.bool,
    /**
     * Id to apply to clear field button.
     */
    clearFieldId: PropTypes.string,
    dirty: PropTypes.bool,
    disabled: PropTypes.bool,
    endControl: PropTypes.element,
    error: PropTypes.node,
    /**
     * Will resize the textarea to resize to show all it's content
     */
    fitContent: PropTypes.bool,
    /**
     * Will resize the textarea to be 100% of parent element's width
     */
    fullWidth: PropTypes.bool,
    /**
     * When set to false, will not show clear button.
     */
    hasClearIcon: PropTypes.bool,
    id: PropTypes.string,
    inputRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
    label: PropTypes.node,
    loading: PropTypes.bool,
    /**
     * Prevent user from changing textarea width
     */
    lockWidth: PropTypes.bool,
    marginBottom0: PropTypes.bool,
    name: PropTypes.string,
    /**
     * When true - make textarea enter a new line on Shift+Enter press, and submit on Enter press
     * When false - do whatever the default behaviour is
     */
    newLineOnShiftEnter: PropTypes.bool,
    /**
     * Removes border.
    */
    noBorder: PropTypes.bool,
    /**
     * Callback fired when the input is blurred.
     */
    onBlur: PropTypes.func,
    /**
     * Event handler for text input. Required if a value is supplied.
     */
    onChange: PropTypes.func,
    /**
     * Callback fired when the input is cleared.
     */
    onClearField: PropTypes.func,
    /**
     * Callback fired when the input is focused.
     */
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    /**
     * Event handler for submit. Will fire when `newLineOnShiftEnter` is true and user presses Enter key.
     */
    onSubmitSearch: PropTypes.func,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    rootClass: PropTypes.string,
    startControl: PropTypes.element,
    /**
     * Can be "type" or "number". Standard html attribute.
     */
    type: PropTypes.string,
    valid: PropTypes.bool,
    validationEnabled: PropTypes.bool,
    validStylesEnabled: PropTypes.bool,
    /**
     * String of text to display.
     */
    value: PropTypes.string,
    warning: PropTypes.node,
  };

  static defaultProps = {
    newLineOnShiftEnter: false,
    type: 'text',
    validationEnabled: true,
    validStylesEnabled: false,
    onKeyDown: noop,
    onSubmitSearch: noop,
    onBlur: noop,
    onFocus: noop,
    onClearField: noop,
    value: '',
  };

  constructor(props) {
    super(props);

    // if no id has been supplied, generate a unique one
    this.inputId = props.id ?? uniqueId('textarea-input-');

    this.state = {
      focused: false,
      prevPropsValue: props.value,
      value: props.value,
    };
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

  getRootStyle() {
    return className(
      css.textArea,
      this.props.rootClass,
      { [`${css.fullWidth}`]: this.props.fullWidth },
    );
  }

  getInputGroupStyle() {
    return className(
      formStyles.inputGroup,
      { [`${css.hasClearIcon}`]: this.props.hasClearIcon },
    );
  }

  getInputStyle() {
    const endControl = this.props.endControl ? css.hasEndControl : '';
    const startControl = this.props.startControl ? css.hasStartControl : '';

    return className(
      startControl,
      endControl,
      sharedInputStylesHelper(this.props),
      { [`${css.lockWidth}`]: this.props.lockWidth },
    );
  }

  onFocus = event => {
    const { onFocus } = this.props;

    if (!this.state.focused) {
      this.setState({
        focused: true
      });

      onFocus(event);
    }
  }

  onBlur = event => {
    const { onBlur } = this.props;
    const { currentTarget, relatedTarget } = event;

    if (!(relatedTarget && currentTarget.contains(relatedTarget))) {
      // delay focus stay setting for a whole tick. This is intended to keep the clear button around long enough for its
      // click event to fire on iOS devices.
      this.resetFocusTO = setTimeout(() => {
        this.setState({
          focused: false
        });
      });

      onBlur(event);
    }
  }

  handleChange = (event) => {
    const { onChange } = this.props;

    this.setState({
      value: event.target.value
    });

    // Fire callback
    if (typeof onChange === 'function') {
      onChange(event);
    }
  }

  handleKeyDown = (event) => {
    const {
      onKeyDown,
      onSubmitSearch,
      newLineOnShiftEnter,
    } = this.props;

    if (newLineOnShiftEnter && event.key === 'Enter') {
      if (!event.shiftKey) {
        onSubmitSearch(event);
      }
    }

    onKeyDown(event);
  }

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
      onClearField,
      ...rest
    } = this.props;

    const inputCustom = omitProps(rest, [
      'id',
      'validationEnabled',
      'value',
      'onChange',
      'newLineOnShiftEnter',
      'onSubmitSearch',
      'lockWidth',
      'rootClass',
      'marginBottom0',
    ]);

    const component = (
      <textarea
        aria-required={required}
        aria-invalid={!!(this.props.error)}
        aria-label={inputCustom['aria-label'] || ariaLabel}
        aria-labelledby={inputCustom['aria-labelledby'] || ariaLabelledBy}
        autoFocus={autoFocus}
        className={this.getInputStyle()}
        id={this.inputId}
        name={name}
        ref={inputRef}
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

    if (hasClearIcon
      && !loading
      && this.state.focused
      && this.state.value) {
      clearField = (
        <FormattedMessage id="stripes-components.clearThisField">
          {([_ariaLabel]) => (
            <TextFieldIcon
              aria-label={ariaLabel}
              icon="times-circle-solid"
              id={clearFieldId || `clickable-${this.testId}-clear-field`}
              onClick={onClearField}
              tabIndex="-1"
            />
          )}
        </FormattedMessage>
      );
    }

    if ((!readOnly && clearField) || endControl) {
      endControlElement = (
        <div className={css.endControls}>
          <div className={css.controlGroup} ref={this.endControl}>
            {!readOnly && clearField}
            {endControl}
          </div>
        </div>
      );
    }

    const warningElement = warning ?
      <div className={formStyles.feedbackWarning}>{warning}</div> : null;

    const errorElement = error ?
      <div className={formStyles.feedbackError}>{error}</div> : null;

    const labelElement = label ?
      <Label
        htmlFor={this.inputId}
        required={required}
        readOnly={readOnly}
      >
        {label}
      </Label>
      : null;

    return (
      <div className={this.getRootStyle()}>
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

export default formField(
  TextArea,
  ({ meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    valid: meta.valid,
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);
