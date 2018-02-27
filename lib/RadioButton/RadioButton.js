import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import separateComponentProps from '../../util/separateComponentProps';
import AccessibleFocus from '../AccessibleFocus';
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
    let rootStyle = css.radioButton;
    rootStyle += this.props.inline ? ` ${css.inline}` : '';
    rootStyle += this.props.marginBottom0 ? ` ${css.marginBottom0}` : '';
    return rootStyle;
  }

  render() {
    const { label, input, id } = this.props;
    const [, inputProps] = separateComponentProps(this.props, RadioButton.propTypes);
    const inputId = id || `radio-button-${uniqueId()}`;

    if (input) {
      Object.assign(inputProps, input);
    }

    return (
      <div className={this.getRootStyle()}>
        <input id={inputId} {...inputProps} className={css.input} type="radio" />
        <AccessibleFocus component="label" htmlFor={inputId} className={this.getLabelStyle()}>
          <span className={css.labelPseudo} />
          { label && <span className={css.labelText}>{label}</span>}
        </AccessibleFocus>
      </div>
    );
  }
}

RadioButton.propTypes = propTypes;

export default RadioButton;
