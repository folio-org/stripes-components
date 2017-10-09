import React from 'react';
import PropTypes from 'prop-types';
import css from './Badge.css';

const Badge = props =>
  (<div className={css.root}>{props.children}</div>);

Badge.propTypes = {
  children: PropTypes.node,
};

export default Badge;
