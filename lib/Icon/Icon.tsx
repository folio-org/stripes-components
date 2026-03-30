// @ts-nocheck
import React from "react";
import classNames from "classnames";
import { pickBy, get, mapKeys } from "lodash";
import css from "./Icon.css";
import icons from "./icons";
type IconProps = {
  ariaLabel?: string;
  children?: React.ReactNode;
  icon?: any | ((...args: any[]) => any);
  iconClassName?: string;
  iconPosition?: "start" | "end";
  iconRootClass?: string;
  iconStyle?: "action";
  id?: string;
  size?: "small" | "medium" | "large";
  status?: "error" | "warn" | "success";
  tabIndex?: string;
};

const Icon = React.forwardRef(
  (
    {
      children,
      icon = "default",
      iconClassName,
      iconPosition = "start",
      iconRootClass,
      iconStyle,
      id,
      size = "medium",
      status,
      tabIndex,
      ...rest
    }: IconProps,
    ref,
  ) => {
    const getRootClass = classNames(
      css.icon,
      iconRootClass,
      // If icon position is defined
      { [css[`icon-position-${iconPosition}`]]: children && iconPosition },
      // If a status is defined
      { [css[`status-${status}`]]: status },
      // Icons that contains "left" or "right should flip on dir="rtl"
      {
        [css.flippable]: typeof icon === "string" && icon.match(/(right|left)/),
      },
      // Apply icon style
      { [css[iconStyle]]: iconStyle },
    );

    const getSVGClass = classNames(
      "stripes__icon",
      iconClassName,
      `icon-${icon}`,
      css[size],
    );

    // Defaults to the default-icon
    let IconElement = icons.default;

    // Custom icon
    if (typeof icon === "function") {
      IconElement = icon;
      // Find icon in icons list
    } else if (typeof icon === "string" && typeof icons[icon] === "function") {
      IconElement = get(icons, icon, icons.default);
    }

    const ariaAttributes = pickBy(rest, (_, key) => key.startsWith("aria"));

    const formattedAriaAttributes = mapKeys(ariaAttributes, (_, key) => {
      if (key.startsWith("aria")) {
        return key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      }
      return key;
    });

    return (
      <span
        className={getRootClass}
        id={id}
        ref={ref}
        role="presentation"
        tabIndex={tabIndex}
        {...formattedAriaAttributes}
      >
        <IconElement
          data-test-icon-element
          className={getSVGClass}
          viewBox="0 0 32 32"
          focusable="false"
        />

        {children ? <span className={css.label}>{children}</span> : null}
      </span>
    );
  },
);

Icon.displayName = "Icon";

export default Icon;
