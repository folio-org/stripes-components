import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './Badge.css';

const Badge = props =>
  (
    <span className={classnames(props.className, css.badge, css[props.color], css[props.size])}>
      <span className={css.label}>{props.children}</span>
    </span>
  );

Badge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf(['default', 'primary', 'red']),
  size: PropTypes.oneOf(['small', 'medium']),
};

Badge.defaultProps = {
  color: 'default',
  size: 'medium',
};

export default Badge;
