import React, { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';

import Label from '../Label';
import parseMeta from '../FormField/parseMeta';
import formField from '../FormField';
import omitProps from '../../util/omitProps';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';

import formStyles from '../sharedStyles/form.css';
import css from './TextArea.css';

class TextArea extends Component {
  static propTypes = {
    ariaLabel: PropTypes.string,
    ariaLabelledBy: PropTypes.string,
    autoFocus: PropTypes.bool,
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
     * Event handler for text input. Required if a value is supplied.
     */
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    /**
     * Event handler for submit. Will fire when `newLineOnShiftEnter` is true and user presses Enter key.
     */
    onSubmitSearch: PropTypes.func,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    rootClass: PropTypes.string,
    startControl: PropTypes.element,
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
    validationEnabled: true,
    validStylesEnabled: false,
    onKeyDown: noop,
    onSubmitSearch: noop,
    value: '',
  };

  constructor(props) {
    super(props);

    // if no id has been supplied, generate a unique one
    this.inputId = props.id ?? uniqueId('textarea-input-');

    this.state = {
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
      formStyles.inputGroup,
      this.props.rootClass,
      { [`${css.fullWidth}`]: this.props.fullWidth },
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
        {component}
        <div role="alert">
          {warningElement}
          {errorElement}
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
