import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './Badge.css';

const Badge = ({
  children,
  className,
  color = 'default',
  size = 'medium',
}) => (
  <span className={classnames(className, css.badge, css[color], css[size])}>
    <span className={css.label}>{children}</span>
  </span>
);

Badge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf(['default', 'primary', 'red']),
  size: PropTypes.oneOf(['small', 'medium']),
};

export default Badge;
