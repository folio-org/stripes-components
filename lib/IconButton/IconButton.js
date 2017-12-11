/**
 * Icon Button
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import css from './IconButton.css';

const IconButton = ({ icon, onClick, title, ariaLabel, id, style, className }) => (
  <button className={classNames(css.root, className)} title={title} onClick={onClick} aria-label={ariaLabel} id={id} style={style}>
    <span className={css.icon}>
      <Icon icon={icon} />
    </span>
  </button>
);

IconButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  ariaLabel: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.object,
};

export default IconButton;
