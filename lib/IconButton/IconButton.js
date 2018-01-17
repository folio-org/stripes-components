/**
 * Icon Button
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import css from './IconButton.css';
import Badge from '../Badge';

const IconButton = ({ icon, onClick, onMouseDown, title, ariaLabel, id, style, className, badgeCount, iconClassName, tabIndex, badgeColor }) => (
  <button type="button" onMouseDown={onMouseDown} tabIndex={tabIndex} className={classNames(css.iconButton, { [css.hasBadge]: badgeCount }, className)} title={title} onClick={onClick} aria-label={ariaLabel} id={id} style={style}>
    <Icon icon={icon} iconClassName={iconClassName} />
    { badgeCount !== undefined && <Badge size="medium" color={badgeColor}>{badgeCount}</Badge> }
  </button>
);

IconButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  title: PropTypes.string,
  badgeCount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  badgeColor: PropTypes.string,
  ariaLabel: PropTypes.string,
  id: PropTypes.string,
  tabIndex: PropTypes.string,
  style: PropTypes.object,
};

IconButton.defaultProps = {
  badgeColor: 'primary',
};

export default IconButton;
