/**
 * App Icon
 *
 * Used to display an app's icon
 * in various places across the application
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './AppIcon.css';

<<<<<<< HEAD
const AppIcon = ({ size, icon, style, children, className, tag }) => {
=======
const AppIcon = ({ iconStyle, iconSize, icon, style, active, children, className, tag, focusable }) => {
>>>>>>> e1de063... Added focusable prop which controls if an app icon can be focused when inside a button or anchor-tag
  /**
   * Formatted Icon

   ** Work in progress **
    Here we determine what to return
<<<<<<< HEAD
   from a icon object once this is in place
   It's getting discussed here: https://issues.folio.org/browse/STCOR-117 */
=======
   from a icon object once this is in place */
>>>>>>> e1de063... Added focusable prop which controls if an app icon can be focused when inside a button or anchor-tag
  const formattedIcon = () => null;

  /**
   * Check if we have an icon
   */
<<<<<<< HEAD
  const hasIcon = icon || children;
=======
  const hasIcon = !icon || !children;
>>>>>>> e1de063... Added focusable prop which controls if an app icon can be focused when inside a button or anchor-tag

  /**
   * Return icon or placeholder
   */
  const getIcon = () => {
<<<<<<< HEAD
    /* If we have a child (image or svg) */
    if (children) {
      return children;
    }

    /* Return null to show placeholder */
    if (!hasIcon) {
      return null;
=======
    /* Return null to show placeholder icon for icon style: block */
    if (!hasIcon && iconStyle === 'block') {
      return null;
    }

    /* Placeholder icon for icon style: outline */
    if (!hasIcon && iconStyle === 'outline') {
      return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 19.2c3.9 0 7.2-3.2 7.2-7.2S15.9 4.8 12 4.8 4.8 8.1 4.8 12s3.3 7.2 7.2 7.2z" /></svg>);
    }

    /* If we have a child (image or svg) */
    if (children) {
      return children;
>>>>>>> e1de063... Added focusable prop which controls if an app icon can be focused when inside a button or anchor-tag
    }

    /* Return formatted icon */
    return formattedIcon();
  };

  /**
   * Root CSS styles
   */
  const rootStyles = classNames(
    /* Base app icon styling */
<<<<<<< HEAD
    css.appIcon,
    /* Icon size */
    css[size],
    /* No icon - add placeholder styling */
    { [css.noIcon]: !hasIcon },
    /* Custom ClassName */
    className,
=======
    css.appIconRoot,
    /* Icon size */
    css[iconSize],
    /* Icon style (type of icon) */
    css[iconStyle],
    /* No icon - add placeholder styling */
    { [css.noIcon]: !hasIcon },
    /* Active class */
    { [css.isActive]: active },
    /* Custom ClassName */
    className,
  );

  /**
   * Icon styles
   */
  const iconStyles = classNames(
    css.icon,
    /* Icon is focusable (if inside focusable element) */
    { [css.focusable]: focusable },
>>>>>>> e1de063... Added focusable prop which controls if an app icon can be focused when inside a button or anchor-tag
  );

  /**
   * Element - changeable by prop
   */
  const Element = tag;

  /**
   * Render
   */
  return (
    <Element className={rootStyles} style={style}>
<<<<<<< HEAD
      {getIcon()}
=======
      <span className={iconStyles}>
        {getIcon()}
      </span>
>>>>>>> e1de063... Added focusable prop which controls if an app icon can be focused when inside a button or anchor-tag
    </Element>
  );
};

AppIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
<<<<<<< HEAD
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.object,
  className: PropTypes.string,
  tag: PropTypes.string,
=======
  iconSize: PropTypes.oneOf(['small', 'medium', 'large']),
  iconStyle: PropTypes.oneOf(['outline', 'block']),
  style: PropTypes.style,
  className: PropTypes.string,
  focusable: PropTypes.bool,
  tag: PropTypes.tag,
>>>>>>> e1de063... Added focusable prop which controls if an app icon can be focused when inside a button or anchor-tag
  children: PropTypes.element,
};

AppIcon.defaultProps = {
<<<<<<< HEAD
  size: 'medium',
  tag: 'span',
  focusable: false,
=======
  iconSize: 'medium',
  iconStyle: 'block',
  tag: 'span',
  focusable: true,
>>>>>>> e1de063... Added focusable prop which controls if an app icon can be focused when inside a button or anchor-tag
};

export default AppIcon;
