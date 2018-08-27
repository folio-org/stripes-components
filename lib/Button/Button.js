/* eslint-disable react/button-has-type */
import React from 'react';
import className from 'classnames';
import Link from 'react-router-dom/Link';
import PropTypes from 'prop-types';
import css from './Button.css';
import omitProps from '../../util/omitProps';

export const propTypes = {
  align: PropTypes.string,
  allowAnchorClick: PropTypes.bool,
  autoFocus: PropTypes.bool,
  bottomMargin0: PropTypes.bool,
  buttonClass: PropTypes.string,
  buttonRef: PropTypes.func,
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
  type: PropTypes.string,
};

const defaultProps = {
  buttonStyle: 'default',
  role: 'button',
  type: 'button',
};

function Button(props) {
  function getStyle() {
    const buttonBuiltIn = [];
    if (/\s/.test(props.buttonStyle)) {
      const csslist = props.buttonStyle.split(/\s+/);
      csslist.forEach((classname) => { buttonBuiltIn.push(css[classname]); });
    } else {
      buttonBuiltIn.push(css[props.buttonStyle]);
    }
    return className(
      css.button,
      buttonBuiltIn,
      { [`${css.marginBottom0}`]: props.marginBottom0 },
      { [`${css.marginBottom0}`]: props.bottomMargin0 },
      { [`${css.paddingSide0}`]: props.paddingSide0 },
      { [`${css.fullWidth}`]: props.fullWidth },
      { [`${css.floatEnd}`]: props.align === 'end' },
      props.buttonClass,
    );
  }

  function handleAnchorClick(e) {
    if (e && !props.allowAnchorClick) e.preventDefault();
    props.onClick(e);
  }

  function getButtonRef(ref) {
    if (props.buttonRef) {
      props.buttonRef(ref);
    }
  }

  const inputCustom = omitProps(props, [
    'buttonClass',
    'buttonStyle',
    'bottomMargin0',
    'marginBottom0',
    'paddingSide0',
    'align',
    'hollow',
    'fullWidth',
    'bsRole',
    'bsClass',
    'onClick',
    'allowAnchorClick',
    'buttonRef',
    'type',
    'to',
  ]);
  const { children, onClick, type, to } = props;

  const buttonInner = <span className={css.buttonInner}>{children}</span>;
  const sharedProps = {
    ...inputCustom,
    onClick,
    className: getStyle(),
    ref: getButtonRef,
  };

  // Render a react router link
  // if the "to" prop is provided
  if (to) {
    return (
      <Link
        to={to}
        role="button"
        {...sharedProps}
      >
        {buttonInner}
      </Link>
    );
  }

  // Render a regular anchor tag
  // if the "href" prop is provided
  if (props.href) {
    return (
      <a
        role="button"
        href={props.href}
        {...sharedProps}
        onClick={handleAnchorClick}
      >
        {buttonInner}
      </a>
    );
  }

  // Render a button element as default
  return (
    <button
      type={type}
      {...sharedProps}
    >
      {buttonInner}
    </button>
  );
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
