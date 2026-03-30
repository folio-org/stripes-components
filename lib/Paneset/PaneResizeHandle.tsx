// @ts-nocheck
import React from "react";
import classnames from "classnames";
import css from "./PaneResize.css";
type PaneResizeHandleProps = {
  active?: boolean;
  id?: string;
  onMouseDown?: (...args: any[]) => any;
  xpos?: number;
};

const PaneResizeHandle = React.forwardRef(
  ({ id, xpos, onMouseDown, active }: PaneResizeHandleProps, ref) => {
    const handleMouseDown = (e) => {
      onMouseDown(e, id);
    };

    return (
      <div
        role="presentation"
        ref={ref}
        onMouseDown={handleMouseDown}
        className={classnames(css.handle, { [css.active]: active })}
        style={{
          left: `${xpos}px`,
        }}
      >
        &nbsp;
      </div>
    );
  },
);

PaneResizeHandle.displayName = "PaneResizeHandle";
export default PaneResizeHandle;
