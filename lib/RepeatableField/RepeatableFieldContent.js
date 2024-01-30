import React from "react";

import {getNextFocusable} from "../../util/getFocusableElements";

import css from "./RepeatableField.css";

export const RepeatableFieldContent = ({ children, last }) => {
  const callbackRef = (node) => {
    if (node) {
      const elem = getNextFocusable(node, true, true);

      if (last) {
        elem?.focus();
      }
    }
  }

  return (
    <div className={css.repeatableFieldItemContent} ref={callbackRef}>
      {children}
    </div>
  );
}
