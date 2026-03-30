// @ts-nocheck
import React from "react";
import css from "./PaneMenu.css";
type PaneMenuProps = { children?: React.ReactNode };

const PaneMenu = (props: PaneMenuProps) => (
  <div className={css.paneMenu}>{props.children}</div>
);

export default PaneMenu;
