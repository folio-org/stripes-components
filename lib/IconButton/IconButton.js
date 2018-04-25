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

const IconButton = ({ icon, autoFocus, onClick, onMouseDown, title, type, ariaLabel, id, style, className, badgeCount, iconClassName, tabIndex, badgeColor, href, to, size, iconSize, ...rest }) => {
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
    autoFocus,
    ...rest,
    'className': classNames(css.iconButton, { [css.hasBadge]: badgeCount }, css[size], className),
    'aria-label': ariaLabel,
  };

  /**
   * If button is a link
   */
  if (href || to) {
    buttonProps = Object.assign(buttonProps, { to: href || to, type: '' });
    Element = Link;
  }

  return (
    <Element {...buttonProps}>
      <span className={classNames(css.iconButtonInner, css[`${size}Offset`])} {...rest}>
        <Icon icon={icon} size={iconSize} iconClassName={iconClassName} />
        { badgeCount !== undefined && <Badge size="medium" color={badgeColor}>{badgeCount}</Badge> }
      </span>
    </Element>
  );
};

IconButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  href: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
  autoFocus: PropTypes.bool,
};

IconButton.defaultProps = {
  badgeColor: 'default',
  type: 'button',
  size: 'medium',
  iconSize: 'medium',
};

export default IconButton;
