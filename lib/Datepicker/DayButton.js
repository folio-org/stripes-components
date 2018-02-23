import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onFocus: PropTypes.func,
  className: PropTypes.string,
  onDayClick: PropTypes.func,
  title: PropTypes.string,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.node,
  id: PropTypes.string,
  day: PropTypes.object,
};

const DayButton = (props) => {
  const { children, onDayClick, day, ...rest } = props;

  function handleClick(e) {
    onDayClick(day, e);
  }

  return (
    <button
      onClick={handleClick}
      tabIndex="-1"
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
};

DayButton.propTypes = propTypes;

export default DayButton;
