// @ts-nocheck
import React from "react";
import classNames from "classnames";
import css from "./FocusLink.css";
import { getNextFocusable } from "../../util/getFocusableElements";
type FocusLinkProps = {
  children?: React.ReactNode[] | React.ReactNode;
  className?: string;
  component?: string;
  sendOnFocus?: boolean;
  showOnFocus?: boolean;
  tabIndex?: number;
  target?: Record<string, any> | string;
  targetNextAfter?: React.ReactElement | ((...args: any[]) => any);
};

const FocusLink = ({
  children,
  className,
  component,
  sendOnFocus,
  showOnFocus,
  tabIndex,
  target,
  targetNextAfter,
  ...rest
}: FocusLinkProps) => {
  let link = null;

  const focusTarget = () => {
    if (typeof target === "string") {
      let id = target;

      if (target.charAt(0) === "#") {
        id = target.replace("#", "");
      }

      const tgt = document.getElementById(id);
      if (tgt) {
        tgt.focus();
      }
    } else if (typeof target === "object") {
      target.focus();
    }
  };

  const focusNext = () => {
    let nextFocusable;
    if (targetNextAfter) {
      if (typeof targetNextAfter === "function") {
        nextFocusable = getNextFocusable(targetNextAfter(), false);
      } else {
        nextFocusable = getNextFocusable(targetNextAfter, false);
      }
    } else {
      nextFocusable = getNextFocusable(link, false);
    }
    nextFocusable.focus();
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (target) {
      focusTarget();
    } else {
      focusNext();
    }
  };

  const handleKeyDown = (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      if (target) {
        focusTarget();
      } else {
        focusNext();
      }
    }
  };

  const getClass = () => {
    return classNames(
      css.focusLink,
      { [`${css.showOnFocus}`]: showOnFocus },
      className,
    );
  };

  if (component) {
    const Component = component;
    return (
      <Component
        data-test-focus-link
        ref={(ref) => {
          link = ref;
        }}
        role="button"
        tabIndex={tabIndex || 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={getClass()}
        onFocus={sendOnFocus && focusTarget}
        {...rest}
      >
        {children}
      </Component>
    );
  }
  return (
    <div
      data-test-focus-link
      ref={(ref) => {
        link = ref;
      }}
      role="button"
      tabIndex={tabIndex || 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={getClass()}
      onFocus={sendOnFocus && focusTarget}
      {...rest}
    >
      {children}
    </div>
  );
};

export default FocusLink;
