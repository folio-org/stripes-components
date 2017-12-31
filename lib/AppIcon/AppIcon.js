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

const AppIcon = ({ iconStyle, iconSize, icon, style, active, children, className, tag, focusable }) => {
  /**
   * Formatted Icon

   ** Work in progress **
    Here we determine what to return
   from a icon object once this is in place */
  const formattedIcon = () => null;

  /**
   * Check if we have an icon
   */
  const hasIcon = !icon || !children;

  /**
   * Return icon or placeholder
   */
  const getIcon = () => {
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
    }

    /* Return formatted icon */
    return formattedIcon();
  };

  /**
   * Root CSS styles
   */
  const rootStyles = classNames(
    /* Base app icon styling */
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
  );

  /**
   * Element
   */
  const Element = tag;

  /**
   * Render
   */
  return (
    <Element className={rootStyles} style={style}>
      <span className={iconStyles}>
        {getIcon()}
      </span>
    </Element>
  );
};

AppIcon.propTypes = {
  active: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  iconSize: PropTypes.oneOf(['small', 'medium', 'large']),
  iconStyle: PropTypes.oneOf(['outline', 'block']),
  style: PropTypes.style,
  className: PropTypes.string,
  focusable: PropTypes.bool,
  tag: PropTypes.tag,
  children: PropTypes.element,
};

AppIcon.defaultProps = {
  iconSize: 'medium',
  iconStyle: 'block',
  tag: 'span',
  focusable: true,
};

export default AppIcon;
