/* eslint-disable react/button-has-type */
import React from 'react';
import className from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import css from './Button.css';
import omitProps from '../../util/omitProps';

export const propTypes = {
  align: PropTypes.string,
  allowAnchorClick: PropTypes.bool,
  autoFocus: PropTypes.bool,
  bottomMargin0: PropTypes.bool,
  buttonClass: PropTypes.string,
  buttonRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),
  buttonStyle: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  fullWidth: PropTypes.bool,
  href: PropTypes.string,
  marginBottom0: PropTypes.bool,
  onClick: PropTypes.func,
  paddingSide0: PropTypes.bool,
  role: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.string,
};

const Button = React.forwardRef((
  {
    buttonStyle = 'default',
    type = 'button',
    ...rest
  },
  ref) => {
  const props = { buttonStyle, type, ...rest };

  function getStyle() {
    const buttonBuiltIn = [];
    if (/\s/.test(buttonStyle)) {
      const csslist = buttonStyle.split(/\s+/);
      csslist.forEach((classname) => { buttonBuiltIn.push(css[classname]); });
    } else {
      buttonBuiltIn.push(css[buttonStyle]);
    }
    return className(
      css.button,
      buttonBuiltIn,
      { [`${css.marginBottom0}`]: marginBottom0 },
      { [`${css.marginBottom0}`]: bottomMargin0 },
      { [`${css.paddingSide0}`]: paddingSide0 },
      { [`${css.fullWidth}`]: fullWidth },
      { [`${css[`align-${align}`]}`]: align },
      buttonClass,
    );
  }

  function handleAnchorClick(e) {
    if (e && !allowAnchorClick) e.preventDefault();
    if (onClick) {
      onClick(e);
    }
  }

  const inputCustom = omitProps(rest, [
    'hollow',
    'bsRole',
    'bsClass',
    'buttonRef',
  ]);

  const sharedProps = {
    ...inputCustom,
    onClick,
    className: getStyle(),
  };

  // Render a react router link
  // if the "to" prop is provided
  if (to) {
    return (
      <Link
        to={to}
        role="button"
        {...sharedProps}
        innerRef={buttonRef || ref}
      >
        {children}
      </Link>
    );
  }

  // Render a regular anchor tag
  // if the "href" prop is provided
  if (href) {
    return (
      <a
        role="button"
        href={href}
        {...sharedProps}
        onClick={handleAnchorClick}
        ref={buttonRef || ref}
      >
        {children}
      </a>
    );
  }

  // Render a button element as default
  return (
    <button
      type={type}
      {...sharedProps}
      ref={buttonRef || ref}
    >
      <span className={css.inner}>
        {children}
      </span>
    </button>
  );
});

Button.displayName = 'Button';
Button.propTypes = propTypes;

export default Button;
