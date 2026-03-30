// @ts-nocheck
import React from "react";

import css from "./RepeatableField.css";
type RepeatableFieldContentProps = {
  children: React.ReactNode | ((...args: any[]) => any);
};

export const RepeatableFieldContent = ({
  children,
}: RepeatableFieldContentProps) => (
  <div className={css.repeatableFieldItemContent}>{children}</div>
);
