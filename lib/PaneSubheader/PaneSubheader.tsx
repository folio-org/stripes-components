// @ts-nocheck
import React from "react";
import css from "./PaneSubheader.css";
type PaneSubheaderProps = {
  children?: React.ReactNode | React.ReactNode[] | React.ReactElement;
};

const PaneSubheader = ({ children }: PaneSubheaderProps) => (
  <div className={css.subheader}>{children}</div>
);

export default PaneSubheader;
