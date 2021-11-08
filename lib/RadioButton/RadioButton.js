import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import { FormattedMessage } from 'react-intl';

import Label from '../Label';
import Asterisk from '../Label/components/Asterisk';
import formField from '../FormField';
import separateComponentProps from '../../util/separateComponentProps';
import parseMeta from '../FormField/parseMeta';
import css from './RadioButton.css';

class RadioButton extends React.Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    checked: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.node,
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
    required: PropTypes.bool,
    value: PropTypes.string,
    warning: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.id = this.props.id || uniqueId('radio-button-');

    this.state = {
      inputInFocus: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getFeedbackClasses = this.getFeedbackClasses.bind(this);
    this.getFeedbackElement = this.getFeedbackElement.bind(this);
  }

  getContainerStyle() {
    return classNames([
      css.labelInputContainer,
      { [css.radioFocused]: this.state.inputInFocus },
    ]);
  }

  getLabelStyle() {
    return classNames(
      css.radioLabel,
      { [`${css[this.props.labelStyle]}`]: !this.props.labelClass && this.props.labelStyle },
      { [css.labelInteractionStyles]: !this.props.disabled },
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
      { [`${css.disabled}`]: this.props.disabled || this.props.readOnly },
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
      required,
      value
    } = this.props;

    // eslint-disable-next-line react/forbid-foreign-prop-types
    const [, inputCustom] = separateComponentProps(this.props, RadioButton.propTypes);

    return (
      <div className={this.getRootStyle()}>
        <div className={this.getContainerStyle()}>
          <input
            id={this.id}
            type="radio"
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
            readOnly={readOnly}
            required={required}
          />
          <span className={css.labelPseudo} />
          {(label || readOnly) &&
            (
              <Label htmlFor={this.id} className={this.getLabelStyle()}>
                <span className={css.labelText}>
                  {label}
                  {required && <Asterisk />}
                  {readOnly && (
                    <span className="sr-only">
                      <FormattedMessage id="stripes-components.readonly" />
                    </span>
                  )}
                </span>
              </Label>
            )
          }
        </div>
        <div role="alert" style={{ display: 'block' }}>
          {this.getFeedbackElement()}
        </div>
      </div>
    );
  }
}

export default formField(
  RadioButton,
  ({ meta }) => ({
    error: (meta.touched && meta.error ? meta.error : ''),
    warning: (meta.touched ? parseMeta(meta, 'warning') : ''),
  })
);
