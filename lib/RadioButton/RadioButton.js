import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import separateComponentProps from '../../util/separateComponentProps';
import css from './RadioButton.css';
import Icon from '../Icon';

const propTypes = {
  autoFocus: PropTypes.bool,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  id: PropTypes.string,
  inline: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.string,
  marginBottom0: PropTypes.bool,
  meta: PropTypes.object,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  readOnly: PropTypes.bool,
};

class RadioButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.state = {
      inputInFocus: false,
    };
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

  getLabelStyle() {
    return classNames(
      css.radioLabel,
      { [css.labelInteractionStyles]: !(this.props.disabled || this.props.readOnly) },
      { [css.labelFocused]: this.state.inputInFocus },
      { [css.labelDisabled]: this.props.disabled || this.props.readOnly },
      { [css.error]: this.props.error }
    );
  }

  getRootStyle() {
    let rootStyle = css.radioButton;
    rootStyle += this.props.inline ? ` ${css.inline}` : '';
    rootStyle += this.props.marginBottom0 ? ` ${css.marginBottom0}` : '';
    return rootStyle;
  }

  render() {
    const { label, input, disabled } = this.props;
    const [, inputProps] = separateComponentProps(this.props, propTypes);

    if (input) {
      Object.assign(inputProps, input);
    }

    return (
      <div className={this.getRootStyle()}>
        <label htmlFor={this.props.id} className={this.getLabelStyle()}>
          <input
            {...inputProps}
            autoFocus={this.props.autoFocus}
            id={this.props.id}
            className={css.input}
            type="radio"
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            disabled={disabled}
          />
          <span className={css.labelPseudo} />
          { label && (
            <span className={css.labelText}>
              {label}
              { this.props.readOnly && <Icon size="small" icon="lock" /> }
            </span>
          )}
        </label>
      </div>
    );
  }
}

RadioButton.propTypes = propTypes;

export default RadioButton;
