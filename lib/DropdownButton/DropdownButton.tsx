// @ts-nocheck
import React from "react";

import Button from "../Button";
import Icon from "../Icon";
type DropdownButtonProps = {
  align?: string;
  buttonClass?: string;
  buttonStyle?: string;
  children?: string | React.ReactNode;
  fullWidth?: boolean;
  marginBottom0?: boolean;
  paddingSide0?: boolean;
};

const DropdownButton = React.forwardRef(
  ({ children, ...buttonProps }: DropdownButtonProps, ref) => {
    const iconType = buttonProps["aria-expanded"]
      ? "triangle-up"
      : "triangle-down";

    return (
      <Button {...buttonProps} ref={ref}>
        <Icon icon={iconType} size="small" iconPosition="end">
          {children}
        </Icon>
      </Button>
    );
  },
);

export default DropdownButton;
