import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { random } from 'lodash';
import separateComponentProps from '../../util/separateComponentProps';
import css from './Checkbox.css';

const propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  labelClass: PropTypes.string,
  labelStyle: PropTypes.object,
  hover: PropTypes.bool,
  fullWidth: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  inline: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
};

const defaultProps = {
  id: `checkbox-${random(999, 99999)}`,
};

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputChecked: false,
      inputIndeterminate: false,
      inputInFocus: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getFeedbackClasses = this.getFeedbackClasses.bind(this);
    this.getFeedbackElement = this.getFeedbackElement.bind(this);
  }

  componentDidMount() {
    // setting state after mounting can cause layout thrashing, so there's a
    // lint rule to recommend against that unless you know what you're doing.
    // Here, we're inspecting a DOM element (this.input is a ref), which won't
    // be available until after the component mounts. IOW, we know the risks,
    // and we know what we're doing here.
    //
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      inputChecked: this.input.checked,
      inputIndeterminate: this.input.indeterminate,
    });
  }

  getLabelStyle() {
    return classNames(
      { [`${css.checkboxLabel}`]: !this.props.labelClass },
      { [`${css[this.props.labelStyle]}`]: !this.props.labelClass && this.props.labelStyle },
      { [`${css.disabledLabel}`]: this.props.disabled },
      this.props.labelClass,
    );
  }

  getRootStyle() {
    return classNames(
      [`${css.checkbox}`],
      { [`${css.hover}`]: this.props.hover },
      { [`${css.hovered}`]: (this.props.hover && this.state.inputInFocus) },
      { [`${css.fullWidth}`]: this.props.fullWidth },
      { [`${css.marginBottom0}`]: this.props.marginBottom0 },
      { [`${css.inline}`]: this.props.inline },
      this.getFeedbackClasses(),
    );
  }

  // Add feedback class on warning or error
  getFeedbackClasses() {
    const meta = this.props.meta;
    if (typeof meta !== 'object') {
      return [];
    }

    const { warning, error, touched } = meta;
    const classes = [];

    // Check if checkbox is touched and has error or warning
    if (error && touched) {
      classes.push(css.hasError);
    } else if (warning && touched) {
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

    const meta = this.props.meta;
    const error = meta.error;
    const warning = meta.warning;

    // Currently prefering error over warning
    return (<div className={css.checkboxFeedback}>{error || warning}</div>);
  }

  // DEACTIVATED FOR NOW (same styling is found in getRootStyle())
  // getContainerStyle() {
  //   return classNames(
  //     // [`${css.checkbox}`],
  //     { [`${css.fullWidth}`]: this.props.fullWidth },
  //     { [`${css.marginBottom0}`]: this.props.marginBottom0 },
  //     { [`${css.inline}`]: this.props.inline },
  //   );
  // }

  handleChange(e) {
    this.setState({
      inputChecked: this.input.checked,
      inputIndeterminate: this.input.indeterminate,
    });

    if (this.props.input && this.props.input.onChange) {
      this.props.input.onChange(e);
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleFocus(e) {
    this.setState({
      inputInFocus: true,
    });

    if (this.props.input && this.props.input.onFocus) {
      this.props.input.onFocus(e);
    }

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  handleBlur(e) {
    this.setState({
      inputInFocus: false,
    });

    if (this.props.input && this.props.input.onBlur) {
      this.props.input.onBlur(e);
    }

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  render() {
    let cleanedProps;
    let inputProps;
    let inputChecked;
    if (this.props.input) {
      const { input, ...rest } = this.props;
      const { value, ...inputAttr } = input;
      inputProps = { ...inputAttr };
      cleanedProps = { ...rest };
      inputChecked = value;
    } else {
      cleanedProps = this.props;
      inputProps = null;
    }

    const { label } = cleanedProps;
    const [, inputCustom] = separateComponentProps(this.props, Checkbox.propTypes);

    const ariaProps = {};
    if (!this.props.name || !this.props.input) {
      ariaProps['aria-label'] = `checkbox ${this.props.label}`;
    }
    const { ...inputAriaProps } = ariaProps;

    return (
      <div className={this.getRootStyle()}>
        <input
          type="checkbox"
          {...inputAriaProps}
          checked={(inputChecked !== undefined && inputChecked) || (inputCustom.checked !== undefined && inputCustom.checked)}
          {...inputProps}
          {...inputCustom}
          id={this.props.id}
          name={cleanedProps.name}
          className={css.checkboxInput}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          ref={(ref) => { this.input = ref; }}
        />
        <label className={this.getLabelStyle()} htmlFor={this.props.id}>
          {label}
          {this.getFeedbackElement()}
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
