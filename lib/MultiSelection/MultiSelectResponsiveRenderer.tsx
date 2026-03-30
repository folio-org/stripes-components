// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom";
import css from "./MultiSelect.css";

/**
 * MultiSelectResponsiveRenderer -
 *  Small screens - renders children to a portal to the div#OverlayContainer along with
 *    a darkened backdrop.
 *  Larger-than-small - renders standard Multiselect dropdown.
 * @param {*} param0
 * @returns
 */ type MultiSelectResponsiveRendererProps = {
  atSmallMedia?: boolean;
  children?: React.ReactNode;
  isOpen?: boolean;
};
const MultiSelectResponsiveRenderer = ({
  atSmallMedia,
  children,
  isOpen,
}: MultiSelectResponsiveRendererProps) => {
  const elem = document.getElementById("OverlayContainer");

  if (atSmallMedia && elem) {
    return ReactDOM.createPortal(
      <div className={css.mobileBackdrop} data-open={isOpen} hidden={!isOpen}>
        <div className={css.mobileContainer}>{children}</div>
      </div>,

      elem,
    );
  }
  return children;
};

export default MultiSelectResponsiveRenderer;
