// @ts-nocheck
import React from "react";
import classNames from "classnames";

import DefaultPaneFooter from "./DefaultPaneFooter";

import css from "./PaneFooter.css";
type PaneFooterProps = {
  children?: React.ReactNode;
  className?: string;
  element?: string;
  innerClassName?: string;
};

const PaneFooter = React.forwardRef(
  (
    {
      element: Element = "div",
      children,
      className,
      innerClassName,
      ...rest
    }: PaneFooterProps,
    ref,
  ) => (
    <Element ref={ref} className={classNames(css.paneFooter, className)}>
      {children || <DefaultPaneFooter className={innerClassName} {...rest} />}
    </Element>
  ),
);

PaneFooter.displayName = "PaneFooter";

export default PaneFooter;
