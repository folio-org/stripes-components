/**
 * Icon Button
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import Icon from '../Icon';
import css from './IconButton.css';
import Badge from '../Badge';

const IconButton = ({ icon, onClick, onMouseDown, title, type, ariaLabel, id, style, className, badgeCount, iconClassName, tabIndex, badgeColor, href, size, iconSize, ...rest }) => {
  let Element = 'button';

  let buttonProps = {
    icon,
    onClick,
    onMouseDown,
    title,
    type,
    id,
    style,
    tabIndex,
    ...rest,
    'className': classNames(css.iconButton, { [css.hasBadge]: badgeCount }, css[size], className),
    'aria-label': ariaLabel,
  };

  /**
   * If button is a link
   */
  if (href) {
    buttonProps = Object.assign(buttonProps, { to: href, type: '' });
    Element = Link;
  }

  return (
    <Element {...buttonProps}>
      <Icon icon={icon} size={iconSize} iconClassName={iconClassName} />
      { badgeCount !== undefined && <Badge size="medium" color={badgeColor}>{badgeCount}</Badge> }
    </Element>
  );
};

IconButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  href: PropTypes.string,
  type: PropTypes.string,
  iconClassName: PropTypes.string,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  title: PropTypes.string,
  size: PropTypes.oneOf([
    'medium',
    'small',
  ]),
  iconSize: PropTypes.oneOf([
    'small',
    'medium',
  ]),
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
  badgeColor: 'default',
  type: 'button',
  size: 'medium',
  iconSize: 'medium',
};

export default IconButton;
