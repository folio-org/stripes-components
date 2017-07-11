import React from 'react';
import css from './TextArea.css';
import PropTypes from 'prop-types';
import className from 'classnames';

const propTypes = {
  /**
   * Can be "type" or "number". Standard html attribute.
   */
  type: PropTypes.string,
  /**
   * Apply border radius to input.
   */
  rounded: PropTypes.bool,
  /**
   * Removes border.
   */
  noBorder: PropTypes.bool,
  /**
   * String of text to display.
   */
  value: PropTypes.string,
  /**
   * Event handler for text input. Required if a value is supplied.
   */
  onChange: PropTypes.func,
  fullWidth: PropTypes.bool,
  error: PropTypes.string,
  warning: PropTypes.string,
};

const defaultProps = {
  type: 'text',
};

class TextArea extends React.Component {

  getRootStyle() {
    // let rootStyle = css.root;
    // rootStyle += this.props.fullWidth ? ' ' + css.rootFull : '';
    // return rootStyle;
    return className(
      css.root,
      { [`${css.rootFull}`]: this.props.fullWidth },
    );
  }

  getInputStyle() {
    const base = css.textArea;
    const full = this.props.fullWidth ? css.textAreaFull : '';
    let feedback = '', error = '';
    if (this.props.meta) {
      feedback = this.props.meta.error || this.props.meta.warning ? css.textAreaHasFeedback : '';
      error = this.props.meta.touched && this.props.meta.error ? css.textAreaHasError : '';
    }
    const rounded = this.props.rounded ? css.rounded : '';
    const noBorder = this.props.noBorder ? css.noBorder : '';
    const endControl = this.props.endControl ? css.hasEndControl : '';
    const startControl = this.props.startControl ? css.hasStartControl : '';
    const marginBottom0 = this.props.marginBottom0 ? 'marginBottom0' : '';
    return `${base} ${full} ${feedback} ${error} ${rounded} ${noBorder} ${endControl} ${startControl} ${marginBottom0}`;
  }

  getLabelStyle() {
    let labelStyle = css.textAreaLabel;
    labelStyle += this.props.required ? ' ' + css.required : '';
    return labelStyle;
  }

  render() {
    let cleanedProps, inputProps;
    if (this.props.input) {
      var { input, meta: { error, warning, touched }, ...rest } = this.props;
      var { ...inputAttr } = input;
      inputProps = { ...inputAttr };
      cleanedProps = { ...rest };
    } else {
      cleanedProps = this.props;
      inputProps = null;
    }

    const { label, endControl, startControl, rounded, required, fullWidth, bottomMargin0, noBorder, ...inputCustom } = cleanedProps;

    const component = <textarea className={this.getInputStyle()} {...inputProps} {...inputCustom} aria-required={required} ></textarea>;

    let warningElement, errorElement;
    if (this.props.meta) {
      warningElement = touched && warning ? <div className={css.textfieldWarning}>{warning}</div> : null;
      errorElement = touched && error ? <div className={css.textfieldError}>{error}</div> : null;
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
    else {
      return component;
    }
  }
}

TextArea.propTypes = propTypes;
TextArea.defaultProps = defaultProps;

export default TextArea;
