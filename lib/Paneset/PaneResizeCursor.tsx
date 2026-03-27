// @ts-nocheck
import React from "react";
import classnames from "classnames";
import css from "./PaneResize.css";
type PaneResizeCursorProps = { visible?: boolean; xpos?: number };

const PaneResizeCursor = React.forwardRef(
  ({ visible, xpos }: PaneResizeCursorProps, ref) => {
    // the cursor hover aria is expanded by a transparent container div that's 20px wide.
    // the dotted border is centered, so the placement of the div is at the mouse x position minus
    // 10px.
    const cursorHoverHalf = 10;
    return (
      <div
        className={classnames(css.cursorHover, { [css.cursorActive]: visible })}
        style={{
          left: `${xpos - cursorHoverHalf}px`,
        }}
        ref={ref}
        hidden={!visible}
      >
        <div className={css.cursor}>&nbsp;</div>
      </div>
    );
  },
);

PaneResizeCursor.displayName = "PaneResizeCursor";
export default PaneResizeCursor;
