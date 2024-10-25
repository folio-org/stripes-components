import React, { useCallback } from "react";
import PropTypes from "prop-types";

import css from "./RepeatableField.css";

export const RepeatableFieldContent = ({ children }) => (
  <div className={css.repeatableFieldItemContent}>
    {children}
  </div>
);

RepeatableFieldContent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
}
