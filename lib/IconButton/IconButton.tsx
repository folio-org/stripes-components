// @ts-nocheck
/**
 * Icon Button
 */

import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import Icon from "../Icon";
import css from "./IconButton.css";
import Badge from "../Badge";
type IconButtonProps = {
  "aria-expanded"?: boolean;
  "aria-haspopup"?: string | boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  ariaExpanded?: string;
  ariaHasPopup?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  autoFocus?: boolean;
  badgeColor?: string;
  badgeCount?: string | number;
  className?: string;
  disabled?: boolean;
  href?: string;
  icon?: string;
  iconClassName?: string;
  iconSize?: "small" | "medium";
  id?: string;
  innerClassName?: string;
  onClick?: (...args: any[]) => any;
  onMouseDown?: (...args: any[]) => any;
  size?: "medium" | "small";
  style?: Record<string, any>;
  tabIndex?: string;
  to?: string | Record<string, any>;
  type?: string;
};

const IconButton = React.forwardRef(
  (
    {
      icon,
      autoFocus,
      onClick,
      onMouseDown,
      type = "button",
      "aria-expanded": hyphenatedAriaExpanded,
      ariaExpanded,
      "aria-haspopup": hyphenatedAriaHasPopup,
      ariaHasPopup,
      ariaLabelledby,
      "aria-labelledby": hyphenatedAriaLabelledby,
      ariaLabel,
      "aria-label": hyphenatedAriaLabel,
      id,
      style,
      className,
      badgeCount,
      iconClassName,
      innerClassName,
      tabIndex,
      badgeColor = "default",
      href,
      to,
      size = "medium",
      iconSize = "medium",
      disabled = false,
      ...rest
    }: IconButtonProps,
    ref,
  ) => {
    let Element = "button";

    let buttonProps = {
      icon,
      onClick,
      onMouseDown,
      type,
      id,
      style,
      tabIndex,
      autoFocus,
      ref,
      disabled,
      ...rest,
      className: classNames(
        css.iconButton,
        { [css.hasBadge]: typeof badgeCount !== "undefined" },
        css[size],
        className,
      ),
      "aria-label": hyphenatedAriaLabel || ariaLabel || icon,
      "aria-labelledby": hyphenatedAriaLabelledby || ariaLabelledby,
      "aria-expanded": hyphenatedAriaExpanded || ariaExpanded,
      "aria-haspopup": hyphenatedAriaHasPopup || ariaHasPopup,
    };

    /**
     * If button is a link
     */
    if (href || to) {
      buttonProps = Object.assign(buttonProps, {
        to: href || to,
        type: "",
        ref: null,
        innerRef: ref,
      });
      Element = Link;
    }

    return (
      <Element {...buttonProps}>
        <span
          className={classNames(
            css.iconButtonInner,
            css[`${size}Offset`],
            innerClassName,
          )}
          {...rest}
        >
          <Icon
            icon={icon}
            size={iconSize}
            iconRootClass={css.icon}
            iconClassName={iconClassName}
          />
          {badgeCount !== undefined && (
            <Badge size="medium" color={badgeColor}>
              {badgeCount}
            </Badge>
          )}
        </span>
      </Element>
    );
  },
);

export default IconButton;
