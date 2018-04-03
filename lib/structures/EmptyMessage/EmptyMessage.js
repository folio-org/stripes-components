/**
 * <EmptyMessage />
 */

import React from 'react';
import PropTypes from 'prop-types';
import css from './EmptyMessage.css';

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

const EmptyMessage = ({ children }) => (
  <div className={css.emptyMessage}>
    {children}
  </div>
);

EmptyMessage.propTypes = propTypes;

export default EmptyMessage;
