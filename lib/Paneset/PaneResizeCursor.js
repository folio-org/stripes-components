import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './PaneResize.css';

const PaneResizeCursor = React.forwardRef(({ visible, xpos }, ref) => {
  const cursorHoverHalf = 10;
  return (
    <div
      className={classnames(css.cursorHover, { [css.cursorActive]: visible })}
      style={{
        left: `${xpos - cursorHoverHalf}px`
      }}
      ref={ref}
      hidden={!visible}
    >
      <div
        className={css.cursor}
      >
        &nbsp;
      </div>
    </div>
  );
});
PaneResizeCursor.propTypes = {
  visible: PropTypes.bool,
  xpos: PropTypes.number
};

PaneResizeCursor.displayName = 'PaneResizeCursor';
export default PaneResizeCursor;
