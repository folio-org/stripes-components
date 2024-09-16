/**
 * Icon Button
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import css from './IconButton.css';
import Badge from '../Badge';

const IconButton = React.forwardRef(({
  icon,
  autoFocus,
  onClick,
  onMouseDown,
  type = 'button',
  'aria-expanded' : hyphenatedAriaExpanded,
  ariaExpanded,
  'aria-haspopup' : hyphenatedAriaHasPopup,
  ariaHasPopup,
  ariaLabelledby,
  'aria-labelledby' : hyphenatedAriaLabelledby,
  ariaLabel,
  'aria-label': hyphenatedAriaLabel,
  id,
  style,
  className,
  badgeCount,
  iconClassName,
  innerClassName,
  tabIndex,
  badgeColor = 'default',
  href,
  to,
  size = 'medium',
  iconSize = 'medium',
  disabled = false,
  ...rest
}, ref) => {
  let Element = 'button';

  let buttonProps = {
    icon,
    onClick,
    onMouseDown,
    type,
    id,
    style,
    tabIndex,
    autoFocus,
    ref,
    disabled,
    ...rest,
    'className': classNames(
      css.iconButton,
      { [css.hasBadge]: typeof badgeCount !== 'undefined' },
      css[size],
      className
    ),
    'aria-label': hyphenatedAriaLabel || ariaLabel || icon,
    'aria-labelledby': hyphenatedAriaLabelledby || ariaLabelledby,
    'aria-expanded': hyphenatedAriaExpanded || ariaExpanded,
    'aria-haspopup': hyphenatedAriaHasPopup || ariaHasPopup,
  };

  /**
   * If button is a link
   */
  if (href || to) {
    buttonProps = Object.assign(
      buttonProps,
      {
        to: href || to,
        type: '',
        ref: null,
        innerRef: ref
      }
    );
    Element = Link;
  }

  return (
    <Element {...buttonProps}>
      <span className={classNames(css.iconButtonInner, css[`${size}Offset`], innerClassName)} {...rest}>
        <Icon icon={icon} size={iconSize} iconRootClass={css.icon} iconClassName={iconClassName} />
        { badgeCount !== undefined && <Badge size="medium" color={badgeColor}>{badgeCount}</Badge> }
      </span>
    </Element>
  );
});

IconButton.propTypes = {
  'aria-expanded': PropTypes.bool,
  'aria-haspopup': PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  'aria-label': PropTypes.string,
  'aria-labelledby': PropTypes.string,
  ariaExpanded: PropTypes.string,
  ariaHasPopup: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLabelledby: PropTypes.string,
  autoFocus: PropTypes.bool,
  badgeColor: PropTypes.string,
  badgeCount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  iconSize: PropTypes.oneOf([
    'small',
    'medium',
  ]),
  id: PropTypes.string,
  innerClassName: PropTypes.string,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  size: PropTypes.oneOf([
    'medium',
    'small',
  ]),
  style: PropTypes.object,
  tabIndex: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.string,
};

export default IconButton;
