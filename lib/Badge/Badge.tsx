// @ts-nocheck
import React from "react";
import classnames from "classnames";
import css from "./Badge.css";
type BadgeProps = {
  children?: React.ReactNode;
  className?: string;
  color?: "default" | "primary" | "red";
  size?: "small" | "medium";
};

const Badge = ({
  children,
  className,
  color = "default",
  size = "medium",
}: BadgeProps) => (
  <span className={classnames(className, css.badge, css[color], css[size])}>
    <span className={css.label}>{children}</span>
  </span>
);

export default Badge;
