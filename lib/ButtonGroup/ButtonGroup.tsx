// @ts-nocheck
import React from "react";
import classnames from "classnames";
import css from "./ButtonGroup.css";
type ButtonGroupProps = {
  children?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  tagName?: string;
};

const ButtonGroup = ({
  children,
  className,
  fullWidth = false,
  tagName: Tag = "div",
  ...rest
}: ButtonGroupProps) => {
  return (
    <Tag
      className={classnames(
        css.buttonGroup,
        { [`${css.fullWidth}`]: fullWidth },
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default ButtonGroup;
