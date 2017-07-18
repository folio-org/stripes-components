import React from 'react';
import PropTypes from 'prop-types';
import css from './RadioButton.css';

const propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  inline: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  children: PropTypes.any,
  id: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool,
};

class RadioButton extends React.Component {

  getLabelStyle() {
    let labelStyle = css.radioLabel;
    labelStyle += this.props.error ? ' ' + css.error : '';
    return labelStyle;
  }

  getRootStyle() {
    let rootStyle = css.root;
    rootStyle += this.props.inline ? ' ' + css.inline : '';
    rootStyle += this.props.marginBottom0 ? ' ' + css.marginBottom0 : '';
    return rootStyle;
  }

  render() {
    let style = {
      display: this.props.inline ? 'inline' : 'block',
    };
    const { inline, error, label, children, marginBottom0, ...inputProps } = this.props;
    return (
      <div className={this.getRootStyle()}>
        <input {...inputProps} className={css.input} type="radio" />
        <label htmlFor={this.props.id} className={this.getLabelStyle()}>{label}</label>
      </div>
    );
  }
}

RadioButton.propTypes = propTypes;

export default RadioButton;
