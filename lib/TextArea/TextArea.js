import React, { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import css from './TextArea.css';
import omitProps from '../../util/omitProps';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import formStyles from '../sharedStyles/form.css';

export default class TextArea extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    endControl: PropTypes.element,
    error: PropTypes.string,
    fullWidth: PropTypes.bool,
    id: PropTypes.string,
    input: PropTypes.object,
    inputRef: PropTypes.func,
    label: PropTypes.string,
    marginBottom0: PropTypes.bool,
    meta: PropTypes.object,
    /**
     * Removes border.
     */
    noBorder: PropTypes.bool,
    /**
     * Event handler for text input. Required if a value is supplied.
     */
    onChange: PropTypes.func,
    required: PropTypes.bool,
    startControl: PropTypes.element,
    /**
     * Can be "type" or "number". Standard html attribute.
     */
    type: PropTypes.string,
    validationEnabled: PropTypes.bool,
    validStylesEnabled: PropTypes.bool,
    /**
     * String of text to display.
     */
    value: PropTypes.string,
    warning: PropTypes.string,
  };

  static defaultProps = {
    type: 'text',
    validationEnabled: true,
    validStylesEnabled: false,
  };

  getRootStyle() {
    return className(
      formStyles.inputGroup,
      css.textArea,
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
    );
  }

  getLabelStyle() {
    return className(
      formStyles.label,
      { [`${css.required}`]: this.props.required },
    );
  }

  render() {
    let cleanedProps;
    let input;
    let error;
    let warning;
    let touched;
    let rest;
    let inputProps;
    if (this.props.input) {
      ({ input, meta: { error, warning, touched }, ...rest } = this.props);
      const { ...inputAttr } = input;
      inputProps = { ...inputAttr };
      cleanedProps = { ...rest };
    } else {
      cleanedProps = this.props;
      inputProps = null;
    }

    /* eslint-disable no-unused-vars */
    const {
      label,
      endControl,
      startControl,
      required,
      fullWidth,
      bottomMargin0,
      noBorder,
      inputRef,
      validStylesEnabled,
      ...inputCustom
    } = cleanedProps;
    /* eslint-enable no-unused-vars */

    const component = (
      <textarea
        className={this.getInputStyle()}
        {...inputProps}
        {...omitProps(inputCustom, ['meta', 'validationEnabled'])}
        aria-required={required}
        ref={cleanedProps.inputRef}
        autoFocus={this.props.autoFocus}
      />
    );

    let warningElement;
    let errorElement;
    if (this.props.meta) {
      warningElement = touched && warning ?
        <div className={formStyles.feedbackWarning}>{warning}</div> : null;
      errorElement = touched && error ?
        <div className={formStyles.feedbackError}>{error}</div> : null;
    }

    const labelElement = label ?
      <label
        htmlFor={this.props.id}
        className={this.getLabelStyle()}
      >
        {this.props.label}
      </label>
      : null;

    return (
      <div className={this.getRootStyle()}>
        {labelElement}
        {component}
        {warningElement}
        {errorElement}
      </div>
    );
  }
}
