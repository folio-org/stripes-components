import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import separateComponentProps from '../../util/separateComponentProps';
import css from './RadioButton.css';

const propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  inline: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  children: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
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
      { [css.labelFocused]: this.state.inputInFocus },
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
    const { label, input } = this.props;
    const [, inputProps] = separateComponentProps(this.props, RadioButton.propTypes);

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
          />
          <span className={css.labelPseudo} />
          { label && <span className={css.labelText}>{label}</span>}
        </label>
      </div>
    );
  }
}

RadioButton.propTypes = propTypes;

export default RadioButton;
