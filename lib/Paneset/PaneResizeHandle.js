import React from 'react';
import PropTypes from 'prop-types';
import css from './PaneResize.css';
import classnames from 'classnames';

const PaneResizeHandle = React.forwardRef(({ id, xpos, onMouseDown, active }, ref) => {

  const handleMouseDown = (e) => {
    onMouseDown(e, id);
  };

  return (
    <div
      role="presentation"
      ref={ref}
      onMouseDown={handleMouseDown}
      className={classnames(
        css.handle,
        {[css.active]: active}
      )
      }
      style={{
        left: `${xpos}px`
      }}
    >
      &nbsp;
    </div>
  );
});

PaneResizeHandle.propTypes = {
  active: PropTypes.bool,
  id: PropTypes.string,
  onMouseDown: PropTypes.func,
  xpos: PropTypes.number
};

PaneResizeHandle.displayName = 'PaneResizeHandle';
export default PaneResizeHandle;
