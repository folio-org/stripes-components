import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  day: PropTypes.object,
  id: PropTypes.string,
  onBlur: PropTypes.func,
  onDayClick: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
};

const DayButton = (props) => {
  const { children, onDayClick, day, ...rest } = props;

  function handleClick(e) {
    onDayClick(day, e);
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
};

DayButton.propTypes = propTypes;

export default DayButton;
