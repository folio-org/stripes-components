import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { getFirstFocusable } from "../../util/getFocusableElements";

import css from "./RepeatableField.css";

export const RepeatableFieldContent = ({ children, isFocused }) => {
  const callbackRef = useCallback((node) => {
    if (node) {
      const elem = getFirstFocusable(node, true, true);

      if (isFocused) {
        elem?.focus();
      }
    }
  }, [isFocused])

  return (
    <div className={css.repeatableFieldItemContent} ref={callbackRef}>
      {children}
    </div>
  );
}

RepeatableFieldContent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  isFocused: PropTypes.bool.isRequired,
}
