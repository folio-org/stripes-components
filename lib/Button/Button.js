import React from 'react';
import PropTypes from 'prop-types';
import css from './Button.css';

const propTypes = {
  buttonStyle: PropTypes.string,
  type: PropTypes.string,
  buttonClass: PropTypes.string,
  bsRole: PropTypes.string,
  bsClass: PropTypes.string,
  hollow: PropTypes.bool,
  align: PropTypes.string,
  className: PropTypes.string,
  bottomMargin0: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  fullWidth: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

const defaultProps = {
  buttonStyle: 'primary',
  type: 'button',
};

function Button(props) {

  function getStyle() {
    if (!props.className) {
      let buttonStyle = css.button;
      if (/\s/.test(props.buttonStyle)) {
        const csslist = props.buttonStyle.split(/\s+/);
        csslist.forEach(classname => buttonStyle += ' ' + css[classname]);
      }
      buttonStyle += ' ' + css[props.buttonStyle];

      buttonStyle += props.bottomMargin0 ? ' marginBottom0' : '';
      buttonStyle += props.marginBottom0 ? ' marginBottom0' : '';
      buttonStyle += props.fullWidth ? ' ' + css.fullWidth : '';
      buttonStyle += props.align === 'end' ? ' floatEnd' : '';
      buttonStyle += props.hollow ? ' ' + css.hollow : '';
      return buttonStyle;
    } else {
      return props.className;
    }
  }

  const { buttonStyle, bottomMargin0, marginBottom0, align, hollow, fullWidth, bsRole, bsClass, ...buttonProps } = props;

  return (
    <button className={getStyle()} {...buttonProps}>
      {props.children}
    </button>
  );
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
