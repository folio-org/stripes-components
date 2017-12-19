/**
 * Icon Button
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import css from './IconButton.css';
import Badge from '../Badge';

const IconButton = ({ icon, onClick, onMouseDown, title, ariaLabel, id, style, className, badgeCount, iconClassName, size, tabIndex }) => (
  <button onMouseDown={onMouseDown} tabIndex={tabIndex} className={classNames(css.iconButton, className, css[size])} title={title} onClick={onClick} aria-label={ariaLabel} id={id} style={style}>
    <Icon icon={icon} iconClassName={iconClassName} />
    { badgeCount && (<Badge color="red" className={css.badgeCount}>{badgeCount}</Badge>)}
  </button>
);

IconButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large']),
  iconClassName: PropTypes.string,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  title: PropTypes.string,
  badgeCount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  ariaLabel: PropTypes.string,
  id: PropTypes.string,
  tabIndex: PropTypes.string,
  style: PropTypes.object,
};

IconButton.defaultProps = {
  size: 'large',
};

export default IconButton;
