/**
 * Icon Button
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import css from './IconButton.css';
import Badge from '../Badge';

const IconButton = ({ icon, onClick, title, ariaLabel, id, style, className, badgeCount }) => (
  <button className={classNames(css.root, className)} title={title} onClick={onClick} aria-label={ariaLabel} id={id} style={style}>
    <Icon icon={icon} />
    { badgeCount && (<Badge className={css.badgeCount}>{badgeCount}</Badge>)}
  </button>
);

IconButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  badgeCount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  ariaLabel: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.object,
};

export default IconButton;
