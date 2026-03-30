// @ts-nocheck
/**
 * <EmptyMessage />
 */

import React from "react";
import classnames from "classnames";
import css from "./EmptyMessage.css";
type EmptyMessageProps = { children?: React.ReactNode; className?: string };

const EmptyMessage = ({ children, className, ...rest }: EmptyMessageProps) => (
  <div className={classnames(css.emptyMessage, className)} {...rest}>
    {children}
  </div>
);

export default EmptyMessage;
