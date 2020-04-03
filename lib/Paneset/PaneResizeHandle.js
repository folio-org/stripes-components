import React from 'react';
import PropTypes from 'prop-types';

const PaneResizeHandle = React.forwardRef(({ id, xpos, onMouseDown }, ref) => {
  const handleMouseDown = (e) => {
    onMouseDown(e, id);
  };

  return (
    <div
      role="presentation"
      ref={ref}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: '100%',
        width: '6px',
        cursor: 'col-resize',
        pointerEvents: 'all',
        left: `${xpos}px`
      }}
    >
      &nbsp;
    </div>
  );
});

PaneResizeHandle.propTypes = {
  id: PropTypes.string,
  onMouseDown: PropTypes.func,
  xpos: PropTypes.number,
};

PaneResizeHandle.displayName = 'PaneResizeHandle';
export default PaneResizeHandle;
