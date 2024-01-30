import React from "react";

import { getFirstFocusable } from "../../util/getFocusableElements";

import css from "./RepeatableField.css";

export const RepeatableFieldContent = ({ children, fieldsCount, index }) => {
  const isLastElem = fieldsCount - 1 === index;

  const callbackRef = (node) => {
    if (node) {
      const elem = getFirstFocusable(node, true, true);

      if (isLastElem) {
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
