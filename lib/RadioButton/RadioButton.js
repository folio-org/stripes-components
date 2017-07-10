import React from 'react';
import css from './RadioButton.css'

class RadioButton extends React.Component {
  constructor(props) {
    super(props);
  }


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
      display: this.props.inline ? 'inline' : 'block'
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

export default RadioButton;
