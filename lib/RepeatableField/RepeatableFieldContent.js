import React, {useCallback} from "react";
import PropTypes from "prop-types";

import { getFirstFocusable } from "../../util/getFocusableElements";

import css from "./RepeatableField.css";

export const RepeatableFieldContent = ({ children, fieldsCount, index }) => {
  const isLastElem = fieldsCount - 1 === index;

  const callbackRef = useCallback((node) => {
    if (node) {
      const elem = getFirstFocusable(node, true, true);

      if (isLastElem) {
        elem?.focus();
      }
    }
  }, [isLastElem])

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
  fieldsCount: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
}
