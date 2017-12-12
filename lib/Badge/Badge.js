import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './Badge.css';

const Badge = props =>
  (<div className={classnames(props.className, css.root)}>{props.children}</div>);

Badge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Badge;
