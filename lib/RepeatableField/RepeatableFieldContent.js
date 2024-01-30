import React, {useEffect, useRef} from "react";

import { getFirstFocusable } from "../../util/getFocusableElements";

import css from "./RepeatableField.css";

export const RepeatableFieldContent = ({ children }) => {
  const itemContentRef = useRef(null);

  const elem = getFirstFocusable(itemContentRef.current);

  useEffect(() => {
    elem?.focus();
  }, [elem]);

  return (
    <div className={css.repeatableFieldItemContent} ref={itemContentRef}>
      {children}
    </div>
  );
}
