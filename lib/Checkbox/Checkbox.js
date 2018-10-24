import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import { FormattedMessage } from 'react-intl';

import reduxFormField from '../ReduxFormField';
import Icon from '../Icon';
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
    error: PropTypes.string,
    fullWidth: PropTypes.bool,
    hover: PropTypes.bool,
    id: PropTypes.string,
    inline: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    labelClass: PropTypes.string,
    labelStyle: PropTypes.object,
    marginBottom0: PropTypes.bool,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    readOnly: PropTypes.bool,
    value: PropTypes.string,
    warning: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      inputInFocus: false
    };

    this.id = this.props.id || uniqueId('checkbox-');

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getFeedbackClasses = this.getFeedbackClasses.bind(this);
    this.getFeedbackElement = this.getFeedbackElement.bind(this);
  }

  getLabelStyle() {
    return classNames(
      css.checkboxLabel,
      { [css[this.props.labelStyle]]: !this.props.labelClass && this.props.labelStyle },
      { [css.checkboxInteractionStyles]: !this.props.disabled },
      { [css.disabledLabel]: this.props.disabled },
      { [css.labelFocused]: this.state.inputInFocus },
      this.props.labelClass,
    );
  }

  getRootStyle() {
    return classNames(
      [`${css.checkbox}`],
      { [`${css.noLabel}`]: !this.props.label },
      { [`${css.hover}`]: this.props.hover },
      { [`${css.hovered}`]: (this.props.hover && this.state.inputInFocus) },
      { [`${css.fullWidth}`]: this.props.fullWidth },
      { [`${css.marginBottom0}`]: this.props.marginBottom0 },
      { [`${css.inline}`]: this.props.inline },
      this.props.className,
      this.getFeedbackClasses(),
    );
  }

  // Add feedback class on warning or error
  getFeedbackClasses() {
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
  getFeedbackElement() {
    const hasFeedback = !!this.getFeedbackClasses().length;
    if (!hasFeedback) {
      return false;
    }

    const error = this.props.error;
    const warning = this.props.warning;

    // Currently prefering error over warning
    return (<div className={css.checkboxFeedback}>{error || warning}</div>);
  }

  handleChange(e) {
    const { readOnly, onChange } = this.props;

    // Disable onChange handler if the field is read-only
    if (readOnly) {
      e.preventDefault();
    } else if (onChange) {
      onChange(e);
    }
  }

  handleFocus(e) {
    this.setState({
      inputInFocus: true,
    });

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  handleBlur(e) {
    this.setState({
      inputInFocus: false,
    });

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  render() {
    const {
      autoFocus,
      checked,
      disabled,
      label,
      name,
      readOnly,
      value
    } = this.props;

    // eslint-disable-next-line react/forbid-foreign-prop-types
    const [, inputCustom] = separateComponentProps(this.props, Checkbox.propTypes);

    const ariaProps = {
      // We use aria-labelledby because we need to attach multiple aria messages
      'aria-labelledby': `${this.id}-label`,
    };

    // If the field is read-only we attach another
    // aria message to let screen reader users know
    if (readOnly) {
      ariaProps['aria-labelledby'] = `${ariaProps['aria-labelledby']} ${this.id}-read-only-message`;
    }

    return (
      <div className={this.getRootStyle()}>
        <label className={this.getLabelStyle()}>
          <input
            id={this.id}
            type="checkbox"
            {...ariaProps}
            checked={checked}
            {...inputCustom}
            name={name}
            className={css.checkboxInput}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            disabled={disabled}
            ref={(ref) => { this.input = ref; }}
            autoFocus={autoFocus}
            value={value}
          />
          <span className={css.labelCheck} aria-hidden="true">
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
          { (label || readOnly) &&
            (
              <span className={css.labelText} aria-hidden="true">
                <span id={`${this.id}-label`}>{label}</span>
                { this.props.readOnly && (
                  <Icon size="small" icon="lock">
                    <span hidden id={`${this.id}-read-only-message`}>
                      <FormattedMessage id="stripes-components.readonly" />
                    </span>
                  </Icon>
                ) }
              </span>
            )
          }
        </label>
        {this.getFeedbackElement()}
      </div>
    );
  }
}

export default reduxFormField(
  Checkbox,
  ({ input, meta }) => ({
    checked: input.value,
    onChange: input.onChange,
    onBlur: input.onBlur,
    onFocus: input.onFocus,
    warning: (meta.touched && meta.warning ? meta.warning : ''),
    error: (meta.touched && meta.error ? meta.error : '')
  })
);
