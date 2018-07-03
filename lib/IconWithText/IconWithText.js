/**
 * IconWithText
 */

import React from 'react';
import PropTypes from 'prop-types';
import css from './IconWithText.css';

const IconWithText = ({ text }) => {
  return (
    <span className={css.iconWithText}>
      <span className={css.text}>{text}</span>
    </span>
  );
};

IconWithText.propTypes = {
  text: PropTypes.node,
};

export default IconWithText;
