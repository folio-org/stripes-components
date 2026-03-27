// @ts-nocheck
import React from "react";
import css from "./LayoutBox.css";
type LayoutBoxProps = { children?: React.ReactNode[] | React.ReactNode };

const LayoutBox = (props: LayoutBoxProps) => (
  <div className={css.sectionBox}>{props.children}</div>
);

export default LayoutBox;
