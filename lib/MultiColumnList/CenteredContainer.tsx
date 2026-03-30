// @ts-nocheck
import React, { useRef, useLayoutEffect } from "react";
import scrollParent from "../../util/getScrollParent";
import Layout from "../Layout";
import css from "./MCLRenderer.css";
type CenteredContainerProps = {
  children?: React.ReactNode;
  innerRef?: Record<string, any>;
  role?: string;
  style?: Record<string, any>;
  visible?: boolean;
};

const CenteredContainer = ({
  innerRef,
  visible,
  children,
  role,
  style: styleProp,
}: CenteredContainerProps) => {
  const wrappingElement = useRef(innerRef || null);

  // useLayoutEffect will give us the DOM nodes for measuring just
  // before the browser re-paints the screen, preventing potential flash of
  // the incorrect/ un-centered element.
  useLayoutEffect(() => {
    if (wrappingElement.current) {
      const sp = scrollParent(wrappingElement.current);
      if (sp) {
        wrappingElement.current.style.width = `${sp.offsetWidth}px`;
      }
    }
  });

  return (
    <div
      ref={wrappingElement}
      className={css.mclCenteredContainer}
      style={{
        visibility: `${visible ? "visible" : "hidden"}`,
        height: `${visible ? null : 0}`,
        padding: `${visible ? null : 0}`,
        ...styleProp,
      }}
      role={role}
    >
      <Layout className="textCentered">{children}</Layout>
    </div>
  );
};

export default CenteredContainer;
