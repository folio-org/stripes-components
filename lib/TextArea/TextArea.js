import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import css from './TextArea.css';
import omitProps from '../../util/omitProps';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import formStyles from '../sharedStyles/form.css';

const propTypes = {
  /**
   * Can be "type" or "number". Standard html attribute.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  type: PropTypes.string,
  /**
   * Removes border.
   */
  noBorder: PropTypes.bool,
  /**
   * String of text to display.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  value: PropTypes.string,
  /**
   * Event handler for text input. Required if a value is supplied.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  onChange: PropTypes.func,
  fullWidth: PropTypes.bool,
  error: PropTypes.string,
  warning: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  id: PropTypes.string,
  required: PropTypes.bool,
  validationEnabled: PropTypes.bool,
  validStylesEnabled: PropTypes.bool,
  startControl: PropTypes.element,
  endControl: PropTypes.element,
  marginBottom0: PropTypes.bool,
  label: PropTypes.string,
  inputRef: PropTypes.func,
  autoFocus: PropTypes.bool,
};

const defaultProps = {
  type: 'text',
  validationEnabled: true,
  validStylesEnabled: false,
};

class TextArea extends React.Component {
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
    // let labelStyle = css.textAreaLabel;
    // labelStyle += this.props.required ? ' ' + css.required : '';
    // return labelStyle;
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

    // eslint-disable-next-line no-unused-vars
    const { label, endControl, startControl, required, fullWidth, bottomMargin0, noBorder, inputRef, validStylesEnabled, ...inputCustom } = cleanedProps;

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
      warningElement = touched && warning ? <div className={formStyles.feedbackWarning}>{warning}</div> : null;
      errorElement = touched && error ? <div className={formStyles.feedbackError}>{error}</div> : null;
    }
    if (label || endControl || startControl) {
      return (
        <div className={this.getRootStyle()}>
          <label htmlFor={this.props.id} className={this.getLabelStyle()}>{this.props.label}</label>
          {component}
          {warningElement}
          {errorElement}
        </div>
      );
    }

    return component;
  }
}

TextArea.propTypes = propTypes;
TextArea.defaultProps = defaultProps;

export default TextArea;
