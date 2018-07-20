import React, { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';

import reduxFormField from '../ReduxFormField';
import css from './TextArea.css';
import omitProps from '../../util/omitProps';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import formStyles from '../sharedStyles/form.css';

class TextArea extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    dirty: PropTypes.bool,
    endControl: PropTypes.element,
    error: PropTypes.string,
    fullWidth: PropTypes.bool,
    id: PropTypes.string,
    inputRef: PropTypes.func,
    label: PropTypes.string,
    loading: PropTypes.bool,
    marginBottom0: PropTypes.bool,
    name: PropTypes.string,
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
    touched: PropTypes.bool,
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
    /* eslint-disable no-unused-vars */
    const {
      autoFocus,
      dirty,
      endControl,
      error,
      fullWidth,
      inputRef,
      label,
      loading,
      name,
      noBorder,
      required,
      startControl,
      touched,
      valid,
      validStylesEnabled,
      warning,
      ...inputCustom
    } = this.props;
    /* eslint-enable no-unused-vars */

    const component = (
      <textarea
        aria-required={required}
        autoFocus={autoFocus}
        className={this.getInputStyle()}
        name={name}
        ref={inputRef}
        {...omitProps(inputCustom, ['validationEnabled'])}
      />
    );

    const warningElement = warning ?
      <div className={formStyles.feedbackWarning}>{warning}</div> : null;

    const errorElement = error ?
      <div className={formStyles.feedbackError}>{error}</div> : null;

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

export default reduxFormField(
  TextArea,
  ({ input, meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    loading: meta.asyncValidating,
    name: input.name,
    onBlur: input.onBlur,
    onChange: input.onChange,
    onFocus: input.onFocus,
    touched: meta.touched,
    valid: meta.valid,
    value: input.value,
    warning: (meta.touched && meta.warning ? meta.warning : ''),
  })
);
