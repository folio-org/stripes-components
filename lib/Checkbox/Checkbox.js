import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import { FormattedMessage } from 'react-intl';

import formField from '../FormField';
import Label from '../Label';
import Asterisk from '../Label/components/Asterisk';
import separateComponentProps from '../util/separateComponentProps';
import parseMeta from '../FormField/parseMeta';
import css from './Checkbox.css';

class Checkbox extends React.Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    checked: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ]),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.node,
    fullWidth: PropTypes.bool,
    id: PropTypes.string,
    inline: PropTypes.bool,
    innerClass: PropTypes.string,
    inputRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    label: PropTypes.node,
    labelClass: PropTypes.string,
    labelInfo: PropTypes.node,
    labelInfoClass: PropTypes.string,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ]),
    vertical: PropTypes.bool,
    warning: PropTypes.node,
  };

  static defaultProps = {
    vertical: false,
  };

  constructor(props) {
    super(props);
    this.id = this.props.id || uniqueId('checkbox-');

    // Typecheck for ref callbacks
    if (typeof props.inputRef === 'function') {
      this.input = (ref) => {
        props.inputRef(ref);
        this.input.current = ref;
      };
    } else {
      this.input = props.inputRef || createRef();
    }
  }

  state = {
    inputInFocus: false
  };

  getInnerClasses = () => {
    const { inputInFocus } = this.state;
    const { disabled, innerClass } = this.props;

    return classNames(
      css.inner,
      { [css.checkboxInteractionStyles]: !disabled },
      { [css.disabledLabel]: disabled },
      { [css.labelFocused]: inputInFocus },
      innerClass,
    );
  }

  getRootClasses = () => {
    const { className, fullWidth, vertical, label, disabled, inline, error, readOnly, warning } = this.props;

    return classNames(
      [css.checkbox],
      { [css.fullWidth]: fullWidth },
      { [css.inline]: inline || vertical || !label },
      { [css.vertical]: vertical },
      { [css.disabled]: disabled },
      { [css.readOnly]: readOnly },
      { [css.noLabel]: !label },
      { [css.hasError]: !!error },
      { [css.hasWarning]: !!warning },
      className,
    );
  }

  getLabelClasses = () => {
    const { disabled, labelClass } = this.props;

    return classNames(
      [`${css.label}`],
      { [css.checkboxInteractionStylesControl]: !disabled },
      labelClass,
    );
  }

  renderFeedbackElement = () => {
    const { error, warning } = this.props;
    const hasFeedback = error || warning;

    if (!hasFeedback) {
      return false;
    }

    return (<div className={css.checkboxFeedback}>{error || warning}</div>);
  }

  handleChange = (e) => {
    const { readOnly, onChange } = this.props;

    // Disable onChange handler if the field is read-only
    if (readOnly) {
      e.preventDefault();
    } else if (onChange) {
      onChange(e);
    }
  }

  handleFocus = (e) => {
    this.setState({
      inputInFocus: true,
    });

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  handleBlur = (e) => {
    this.setState({
      inputInFocus: false,
    });

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  renderLabelText = () => {
    const { label, required, readOnly } = this.props;

    return (
      <span className={css.labelText}>
        {label}
        {required && <Asterisk />}
        {readOnly && (
          <span className="sr-only">
            <FormattedMessage id="stripes-components.readonly" />
          </span>
        )}
      </span>
    );
  }

  renderLabelInfo = () => {
    const {
      labelInfo,
      labelInfoClass,
    } = this.props;

    if (typeof labelInfo === 'undefined') {
      return false;
    }

    return (
      <span
        data-test-checkbox-label-info
        className={classNames(
          [`${css.checkBoxLabelInfo}`],
          labelInfoClass,
        )}
      >
        {labelInfo}
      </span>
    );
  }

  render() {
    const {
      autoFocus,
      checked,
      disabled,
      label,
      name,
      readOnly,
      required,
      value,
      vertical,
      error,
    } = this.props;

    // eslint-disable-next-line react/forbid-foreign-prop-types
    const [, inputCustom] = separateComponentProps(this.props, Checkbox.propTypes);

    return (
      <div
        data-test-checkbox
        className={this.getRootClasses()}
      >
        <Label
          tagName={label ? 'label' : 'span'}
          htmlFor={label ? this.id : undefined}
          className={this.getLabelClasses()}
        >
          {(vertical && label) && this.renderLabelText()}
          <span className={this.getInnerClasses()}>
            <input
              id={this.id}
              type="checkbox"
              checked={checked}
              {...inputCustom}
              name={name}
              className={css.input}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              disabled={disabled}
              ref={this.input}
              autoFocus={autoFocus}
              value={value}
              aria-invalid={!!error}
              required={required}
            />
            <span className={css.checkboxIcon}>
              <svg height="10" width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                <path
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  d="M10.395 4.617L5.63 9.383 3.605 7.358"
                />
              </svg>
            </span>
            {(!vertical && (label || readOnly)) && this.renderLabelText()}
            {this.renderLabelInfo()}
          </span>
        </Label>
        <div role="alert">
          {this.renderFeedbackElement()}
        </div>
      </div>
    );
  }
}

export default formField(
  Checkbox,
  ({ meta }) => ({
    error: (meta.touched && meta.error ? meta.error : ''),
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);
