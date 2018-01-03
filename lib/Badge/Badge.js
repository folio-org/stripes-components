import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './Badge.css';

const Badge = props =>
  (<div className={classnames(props.className, css.badge, css[props.color])}>{props.children}</div>);

Badge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf(['default', 'red']),
};

Badge.defaultProps = {
  color: 'default',
};

export default Badge;
