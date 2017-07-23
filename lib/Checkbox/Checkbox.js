import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './Checkbox.css';

const propTypes = {
  checkedIcon: PropTypes.element,
  uncheckedIcon: PropTypes.element,
  tertiaryIcon: PropTypes.element,
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
  }

  componentDidMount() {
    this.setState({
      inputChecked: this.input.checked,
      inputIndeterminate: this.input.indeterminate,
    });
  }

  getLabelStyle() {
    return classNames(
      { [`${css.checkboxLabel}`]: !this.props.labelClass },
      { [`${css[this.props.labelStyle]}`]: !this.props.labelClass && this.props.labelStyle },
      this.props.labelClass,
    );
  }

  getRootStyle() {
    return classNames(
      [`${css.root}`],
      { [`${css.rootHover}`]: this.props.hover },
      { [`${css.hovered}`]: (this.props.hover && this.state.inputInFocus) },
      { [`${css.rootFullWidth}`]: this.props.fullWidth },
      { [`${css.marginBottom0}`]: this.props.marginBottom0 },
      { [`${css.inline}`]: this.props.inline },
      { [`${css.checkboxHasFeedback}`]: (this.props.meta && (this.props.meta.error || this.props.meta.warning)) },
    );
  }

  getContainerStyle() {
    return classNames(
      [`${css.root}`],
      { [`${css.rootFullWidth}`]: this.props.fullWidth },
      { [`${css.marginBottom0}`]: this.props.marginBottom0 },
      { [`${css.inline}`]: this.props.inline },
    );
  }

  getInputStyle() {
    const base = css.checkboxInput;
    let hidden = '';
    if (this.props.checkedIcon || this.props.uncheckedIcon || this.props.tertiaryIcon) {
      hidden = css.hidden;
    }
    return `${base} ${hidden}`;
  }

  handleChange(e) {
    this.setState({
      inputChecked: this.input.checked,
      inputIndeterminate: this.input.indeterminate,
    });

    if (this.props.input) {
      this.props.input.onChange(e);
    } else {
      this.props.onChange(e);
    }
  }

  handleFocus(e) {
    this.setState({
      inputInFocus: true,
    });

    if (this.props.input) {
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

    if (this.props.input) {
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
    let metaTouched;
    let metaWarning;
    if (this.props.input) {
      const { input, meta: { error, warning, touched }, ...rest } = this.props;
      const { onChange, onFocus, onBlur, value, ...inputAttr } = input;
      metaTouched = touched;
      metaWarning = warning;
      inputProps = { ...inputAttr };
      cleanedProps = { ...rest };
      inputChecked = value;
    } else {
      cleanedProps = this.props;
      inputProps = null;
    }

    const { label, required, fullWidth, marginBottom0, hover, checkedIcon, uncheckedIcon, tertiaryIcon, labelStyle, ...inputCustom } = cleanedProps;

    let warningElement;
    if (this.props.meta) {
      warningElement = metaTouched && metaWarning ? <div className={css.checkboxWarning}>{metaWarning}</div> : null;
    }

    let iconElement = null;
    if (checkedIcon || uncheckedIcon || tertiaryIcon) {
      let icon = null;
      if (this.state.inputChecked) {
        icon = this.props.checkedIcon;
      } else {
        icon = this.props.uncheckedIcon;
      }
      if (this.state.inputIndeterminate) {
        icon = this.props.tertiaryIcon;
      }
      iconElement = <label className={css.iconContainer} htmlFor={this.props.id} >{icon}</label>;
    }

    const ariaProps = {};
    if (!this.props.name || !this.props.input) {
      ariaProps['aria-label'] = `checkbox ${this.props.label}`;
    }
    const { ...inputAriaProps } = ariaProps;

    return (
      <div className={this.getContainerStyle()}>
        <div className={this.getRootStyle()}>
          <input
            type="checkbox"
            {...inputAriaProps}
            checked={inputChecked || inputCustom.checked}
            {...inputProps}
            {...inputCustom}
            className={this.getInputStyle()}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            ref={(ref) => { this.input = ref; }}
          />
          {iconElement}
          <label className={this.getLabelStyle()} htmlFor={this.props.id}>
            {label}
          </label>
        </div>
        {warningElement}
      </div>
    );
  }
}

Checkbox.propTypes = propTypes;

export default Checkbox;
