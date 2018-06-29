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

const IconButton = ({
  icon,
  autoFocus,
  onClick,
  onMouseDown,
  title,
  type,
  ariaLabel,
  id,
  style,
  className,
  badgeCount,
  iconClassName,
  tabIndex,
  badgeColor,
  href,
  to,
  size,
  iconSize,
  ...rest
}) => {
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
  ariaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  badgeColor: PropTypes.string,
  badgeCount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  iconSize: PropTypes.oneOf([
    'small',
    'medium',
  ]),
  id: PropTypes.string,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  size: PropTypes.oneOf([
    'medium',
    'small',
  ]),
  style: PropTypes.object,
  tabIndex: PropTypes.string,
  title: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.string,
};

IconButton.defaultProps = {
  badgeColor: 'default',
  iconSize: 'medium',
  size: 'medium',
  type: 'button',
};

export default IconButton;
