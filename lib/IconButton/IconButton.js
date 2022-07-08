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
  'aria-expanded' : hyphenatedAriaExpanded,
  ariaExpanded,
  'aria-haspopup' : hyphenatedAriaHasPopup,
  ariaHasPopup,
  ariaLabelledby,
  'aria-labelledby' : hyphenatedAriaLabelledby,
  ariaLabel,
  'aria-label': hyphenatedAriaLabel,
  autoFocus,
  badgeColor,
  badgeCount,
  children,
  className,
  href,
  icon,
  iconClassName,
  iconPosition,
  iconSize,
  id,
  innerClassName,
  onClick,
  onMouseDown,
  size,
  style,
  tabIndex,
  to,
  type,
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
        {
          children ?
            <Icon
              icon={icon}
              size={iconSize}
              iconRootClass={css.icon}
              iconClassName={iconClassName}
              iconPosition={iconPosition}
            >
              {children}
            </Icon> :
            <Icon
              icon={icon}
              size={iconSize}
              iconRootClass={css.icon}
              iconClassName={iconClassName}
            />
        }
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
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  iconPosition: PropTypes.oneOf([
    'start',
    'end',
  ]),
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

IconButton.defaultProps = {
  badgeColor: 'default',
  iconSize: 'medium',
  size: 'medium',
  type: 'button',
};

export default IconButton;
