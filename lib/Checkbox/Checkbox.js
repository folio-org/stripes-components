import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import separateComponentProps from '../../util/separateComponentProps';
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
      // [`${css.root}`],
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
      const { input, meta: { warning, touched }, ...rest } = this.props;
      const { value, ...inputAttr } = input;

      metaTouched = touched;
      metaWarning = warning;
      inputProps = { ...inputAttr };
      cleanedProps = { ...rest };
      inputChecked = value;
    } else {
      cleanedProps = this.props;
      inputProps = null;
    }

    const { label, checkedIcon, uncheckedIcon, tertiaryIcon } = cleanedProps;
    const [, inputCustom] = separateComponentProps(this.props, Checkbox.propTypes);

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
            id={cleanedProps.id}
            name={cleanedProps.name}
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
