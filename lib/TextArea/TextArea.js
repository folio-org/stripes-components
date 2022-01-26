import React, { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import uniqueId from 'lodash/uniqueId';

import formField from '../FormField';
import css from './TextArea.css';
import omitProps from '../../util/omitProps';
import sharedInputStylesHelper from '../sharedStyles/sharedInputStylesHelper';
import parseMeta from '../FormField/parseMeta';
import formStyles from '../sharedStyles/form.css';
import Label from '../Label';

class TextArea extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    dirty: PropTypes.bool,
    disabled: PropTypes.bool,
    endControl: PropTypes.element,
    error: PropTypes.node,
    fullWidth: PropTypes.bool,
    id: PropTypes.string,
    inputRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
    label: PropTypes.node,
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
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
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
    type: 'text',
    validationEnabled: true,
    validStylesEnabled: false,
  };

  constructor(props) {
    super(props);

    // if no id has been supplied, generate a unique one
    this.inputId = props.id ?? uniqueId('textarea-input-');
  }

  getRootStyle() {
    return className(
      css.textArea,
      formStyles.inputGroup,
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
      readOnly,
      required,
      startControl,
      valid,
      validStylesEnabled,
      warning,
      ...inputCustom
    } = this.props;
    /* eslint-enable no-unused-vars */

    const component = (
      <textarea
        aria-required={required}
        aria-invalid={!!(this.props.error)}
        autoFocus={autoFocus}
        className={this.getInputStyle()}
        id={this.inputId}
        name={name}
        ref={inputRef}
        {...omitProps(inputCustom, ['id', 'validationEnabled'])}
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
