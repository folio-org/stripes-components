import React from 'react';

const PaneResizeCursor = React.forwardRef(({ visible, xpos }, ref) => {
  return (
    <div
      ref={ref}
      hidden={!visible}
      style={{
        position: 'absolute',
        left: xpos,
        height: '100%',
        width: '1px',
        cursor: 'col-resize',
        pointerEvents: 'all',
        borderRight: '1px dashed #666'
      }}
    >
      &nbsp;
    </div>
  );
});
PaneResizeCursor.displayName = 'PaneResizeCursor';
export default PaneResizeCursor;
