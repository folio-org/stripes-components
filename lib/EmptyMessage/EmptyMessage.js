/**
 * <EmptyMessage />
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import css from './EmptyMessage.css';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const EmptyMessage = ({ children, className, ...rest }) => (
  <div className={classnames(css.emptyMessage, className)} {...rest}>
    {children}
  </div>
);

EmptyMessage.propTypes = propTypes;

export default EmptyMessage;
