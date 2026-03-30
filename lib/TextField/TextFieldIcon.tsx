// @ts-nocheck
/**
 * Text Field Icon
 */
import React from "react";
import css from "./TextField.css";
import Icon from "../Icon";
import IconButton from "../IconButton";
type TextFieldIconProps = {
  ariaLabel?: string;
  icon?: string;
  iconClassName?: string;
  iconSize?: string;
  id?: string;
  onClick?: (...args: any[]) => any;
  onMouseDown?: (...args: any[]) => any;
  tabIndex?: string;
};

const TextFieldIcon = ({
  onClick,
  ariaLabel,
  icon,
  iconClassName,
  onMouseDown,
  tabIndex,
  id,
  iconSize = "medium",
  ...rest
}: TextFieldIconProps) => (
  <div className={css.textFieldIcon}>
    {typeof onClick === "function" || typeof onMouseDown === "function" ? (
      <IconButton
        aria-label={rest["aria-label"] || ariaLabel}
        onClick={onClick}
        onMouseDown={onMouseDown}
        tabIndex={tabIndex}
        icon={icon}
        size="small"
        id={id}
        iconClassName={iconClassName}
      />
    ) : (
      <Icon id={id} icon={icon} size={iconSize} iconClassName={iconClassName} />
    )}
  </div>
);

export default TextFieldIcon;
