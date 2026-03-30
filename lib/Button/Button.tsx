// @ts-nocheck
/* eslint-disable react/button-has-type */
import React from "react";
import className from "classnames";
import { Link } from "react-router-dom";
import css from "./Button.css";
import omitProps from "../../util/omitProps";
type ButtonProps = {
  align?: string;
  allowAnchorClick?: boolean;
  autoFocus?: boolean;
  bottomMargin0?: boolean;
  buttonClass?: string;
  buttonRef?: ((...args: any[]) => any) | Record<string, any>;
  buttonStyle?: string;
  children?: React.ReactNode | React.ReactNode[];
  fullWidth?: boolean;
  href?: string;
  marginBottom0?: boolean;
  onClick?: (...args: any[]) => any;
  paddingSide0?: boolean;
  role?: string;
  to?: string | Record<string, any>;
  type?: string;
};

const Button = React.forwardRef(
  ({ buttonStyle = "default", type = "button", ...rest }: ButtonProps, ref) => {
    const props = { buttonStyle, type, ...rest };
    function getStyle() {
      const buttonBuiltIn = [];
      if (/\s/.test(props.buttonStyle)) {
        const csslist = props.buttonStyle.split(/\s+/);
        csslist.forEach((classname) => {
          buttonBuiltIn.push(css[classname]);
        });
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
        { [`${css[`align-${props.align}`]}`]: props.align },
        props.buttonClass,
      );
    }

    function handleAnchorClick(e) {
      if (e && !props.allowAnchorClick) e.preventDefault();
      if (props.onClick) {
        props.onClick(e);
      }
    }

    const inputCustom = omitProps(props, [
      "buttonClass",
      "buttonStyle",
      "bottomMargin0",
      "marginBottom0",
      "paddingSide0",
      "align",
      "hollow",
      "fullWidth",
      "bsRole",
      "bsClass",
      "onClick",
      "allowAnchorClick",
      "buttonRef",
      "type",
      "to",
    ]);
    const { children, onClick, to, buttonRef } = props;

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
    if (props.href) {
      return (
        <a
          role="button"
          href={props.href}
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
      <button type={type} {...sharedProps} ref={buttonRef || ref}>
        <span className={css.inner}>{children}</span>
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
