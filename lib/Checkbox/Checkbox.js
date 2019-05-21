import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import { FormattedMessage } from 'react-intl';

import formField from '../FormField';
import Icon from '../Icon';
import Label from '../Label';
import Asterisk from '../Label/components/Asterisk';
import separateComponentProps from '../../util/separateComponentProps';
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
    hover: PropTypes.bool,
    id: PropTypes.string,
    inline: PropTypes.bool,
    label: PropTypes.node,
    labelClass: PropTypes.string,
    marginBottom0: PropTypes.bool,
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
  }

  state = {
    inputInFocus: false
  };

  getCheckboxClasses = () => {
    const { inputInFocus } = this.state;
    const { labelClass, disabled } = this.props;

    return classNames(
      css.checkbox,
      { [css.checkboxInteractionStyles]: !disabled },
      { [css.disabledLabel]: disabled },
      { [css.labelFocused]: inputInFocus },
      labelClass,
    );
  }

  getRootClasses = () => {
    const { inputInFocus } = this.state;
    const { className, disabled, label, hover, fullWidth, marginBottom0, vertical, inline } = this.props;

    return classNames(
      [`${css.root}`],
      { [css.checkboxInteractionStylesControl]: !disabled },
      { [`${css.noLabel}`]: !label },
      { [`${css.hover}`]: hover },
      { [`${css.hovered}`]: (hover && inputInFocus) },
      { [`${css.fullWidth}`]: fullWidth },
      { [`${css.marginBottom0}`]: marginBottom0 },
      { [`${css.inline}`]: inline || vertical },
      { [`${css.vertical}`]: vertical },
      { [`${css.disabled}`]: disabled },
      className,
      this.getFeedbackClasses(),
    );
  }

  // Add feedback class on warning or error
  getFeedbackClasses = () => {
    const { warning, error } = this.props;
    const classes = [];

    // Check if checkbox has error or warning
    if (error) {
      classes.push(css.hasError);
    } else if (warning) {
      classes.push(css.hasWarning);
    }

    // Add the feedback class if we have feedback classes
    if (classes.length) {
      classes.push(css.hasFeedback);
    }

    return classes;
  }

  // Get feedback element (if the checkbox has any feedback to show)
  getFeedbackElement = () => {
    const { error, warning } = this.props;

    const hasFeedback = !!this.getFeedbackClasses().length;
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
        { label }
        { required && <Asterisk /> }
        { readOnly && (
          <Icon size="small" icon="lock">
            <span className="sr-only">
              <FormattedMessage id="stripes-components.readonly" />
            </span>
          </Icon>
        ) }
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
      <Label htmlFor={label ? this.id : undefined} className={this.getRootClasses()}>
        { (vertical && label) && this.renderLabelText() }
        <span className={this.getCheckboxClasses()}>
          <input
            id={this.id}
            type="checkbox"
            checked={checked}
            {...inputCustom}
            name={name}
            className={classNames('sr-only', css.checkboxInput)}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            disabled={disabled}
            ref={(ref) => { this.input = ref; }}
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
          { (!vertical && (label || readOnly)) && this.renderLabelText() }
        </span>
        <div role="alert">
          {this.getFeedbackElement()}
        </div>
      </Label>
    );
  }
}

export default formField(
  Checkbox,
  ({ meta }) => ({
    error: (meta.touched && meta.error ? meta.error : ''),
    warning: (meta.touched && meta.warning ? meta.warning : ''),
  })
);
