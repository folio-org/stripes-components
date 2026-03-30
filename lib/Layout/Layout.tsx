// @ts-nocheck
import React from "react";
import css from "./Layout.css";
type LayoutProps = {
  children?: string | React.ReactNode[] | React.ReactNode;
  className?: string;
  element?: string | React.ReactElement;
};

function Layout({
  className,
  children,
  element = "div",
  ...rest
}: LayoutProps) {
  const Element = element;

  function getClassName() {
    if (!className) {
      return undefined;
    }
    return className
      .split(" ")
      .map((c) => css[c] || c)
      .join(" ");
  }

  return (
    <Element data-test-layout className={getClassName()} {...rest}>
      {children}
    </Element>
  );
}

export default Layout;
