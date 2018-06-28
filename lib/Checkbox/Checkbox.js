import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import reduxFormField from '../ReduxFormField';
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
    errorText: PropTypes.string,
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
    value: PropTypes.string,
    warningText: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      inputInFocus: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getFeedbackClasses = this.getFeedbackClasses.bind(this);
    this.getFeedbackElement = this.getFeedbackElement.bind(this);
  }

  getLabelStyle() {
    return classNames(
      css.checkboxLabel,
      { [`${css[this.props.labelStyle]}`]: !this.props.labelClass && this.props.labelStyle },
      { [`${css.disabledLabel}`]: this.props.disabled },
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
    const { warningText, errorText } = this.props;
    const classes = [];

    // Check if checkbox has error or warning
    if (errorText) {
      classes.push(css.hasError);
    } else if (warningText) {
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

    const error = this.props.errorText;
    const warning = this.props.warningText;

    // Currently prefering error over warning
    return (<div className={css.checkboxFeedback}>{error || warning}</div>);
  }

  handleChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
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
      id,
      label,
      name,
      value
    } = this.props;

    const [, inputCustom] = separateComponentProps(this.props, Checkbox.propTypes);

    const ariaProps = {};
    if (!name) {
      ariaProps['aria-label'] = `${label}`;
    }
    const { ...inputAriaProps } = ariaProps;

    return (
      <div className={this.getRootStyle()}>
        <label className={this.getLabelStyle()}>
          <input
            id={id}
            type="checkbox"
            {...inputAriaProps}
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
          <span className={css.labelCheck}>
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
          { label && <span className={css.labelText}>{label}</span>}
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
    warningText: (meta.touched && meta.warning ? meta.warning : ''),
    errorText: (meta.touched && meta.error ? meta.error : '')
  })
);
