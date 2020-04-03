import React from 'react';
import PropTypes from 'prop-types';
import css from './PaneResize.css';

const PaneResizeCursor = React.forwardRef(({ visible, xpos }, ref) => {
  return (
    <div
      ref={ref}
      hidden={!visible}
      className={css.cursor}
      style={{
        left: `${xpos}px`
      }}
    >
      &nbsp;
    </div>
  );
});
PaneResizeCursor.propTypes = {
  visible: PropTypes.bool,
  xpos: PropTypes.number
};

PaneResizeCursor.displayName = 'PaneResizeCursor';
export default PaneResizeCursor;
