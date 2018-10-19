import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import reduxFormField from '../ReduxFormField';
import separateComponentProps from '../../util/separateComponentProps';
import css from './RadioButton.css';

class RadioButton extends React.Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    checked: PropTypes.bool,
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
    value: PropTypes.string,
    warning: PropTypes.string,
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
      css.radioLabel,
      { [`${css[this.props.labelStyle]}`]: !this.props.labelClass && this.props.labelStyle },
      { [`${css.disabledLabel}`]: this.props.disabled },
      { [css.labelFocused]: this.state.inputInFocus },
      this.props.labelClass,
    );
  }

  getRootStyle() {
    return classNames(
      [`${css.radioButton}`],
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

    // Check if error or warning
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

  // Get feedback element (if there's any feedback to show)
  getFeedbackElement() {
    const hasFeedback = !!this.getFeedbackClasses().length;
    if (!hasFeedback) {
      return null;
    }

    const error = this.props.error;
    const warning = this.props.warning;

    // Currently prefering error over warning
    return (<div className={css.radioFeedback}>{error || warning}</div>);
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

    // eslint-disable-next-line react/forbid-foreign-prop-types
    const [, inputCustom] = separateComponentProps(this.props, RadioButton.propTypes);

    const ariaProps = {};
    if (!name) {
      ariaProps['aria-label'] = `${label}`;
    }

    return (
      <div className={this.getRootStyle()}>
        <label htmlFor={id} className={this.getLabelStyle()}>
          <input
            id={id}
            type="radio"
            {...ariaProps}
            checked={checked}
            {...inputCustom}
            name={name}
            className={css.input}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            disabled={disabled}
            ref={(ref) => { this.input = ref; }}
            autoFocus={autoFocus}
            value={value}
          />
          <span className={css.labelPseudo} />
          { label && <span className={css.labelText}>{label}</span>}
        </label>
        {this.getFeedbackElement()}
      </div>
    );
  }
}

export default reduxFormField(
  RadioButton,
  ({ input, meta }) => ({
    checked: input.checked,
    onChange: input.onChange,
    onBlur: input.onBlur,
    onFocus: input.onFocus,
    warning: (meta.touched && meta.warning ? meta.warning : ''),
    error: (meta.touched && meta.error ? meta.error : '')
  })
);
