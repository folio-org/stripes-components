import React from 'react';
import PropTypes from 'prop-types';
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
};

class RadioButton extends React.Component {
  getLabelStyle() {
    let labelStyle = css.radioLabel;
    labelStyle += this.props.error ? ` ${css.error}` : '';
    return labelStyle;
  }

  getRootStyle() {
    let rootStyle = css.root;
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
        <input id={this.props.id} {...inputProps} className={css.input} type="radio" />
        <label htmlFor={this.props.id} className={this.getLabelStyle()}>{label}</label>
      </div>
    );
  }
}

RadioButton.propTypes = propTypes;

export default RadioButton;
