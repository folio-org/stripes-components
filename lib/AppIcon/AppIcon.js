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

const AppIcon = ({ onClick, className, iconStyle, iconSize, label, icon, style, active }) => {
  /**
   * Icon
   */
  const getIcon = () => {
    /* Return null to show placeholder icon for icon style: block */
    if (!icon && iconStyle === 'block') {
      return null;
    }

    /* Placeholder icon for icon style: outline */
    if (!icon && iconStyle === 'outline') {
      return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 19.2c3.9 0 7.2-3.2 7.2-7.2S15.9 4.8 12 4.8 4.8 8.1 4.8 12s3.3 7.2 7.2 7.2z"/></svg>);
    }

// return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.892 1.982H6.974A2.14 2.14 0 0 0 4.836 4.12v17.148a.75.75 0 0 0 1.218.585l5.878-4.71 5.879 4.71a.745.745 0 0 0 .794.091.75.75 0 0 0 .425-.676V4.12a2.14 2.14 0 0 0-2.138-2.138zm.638 17.725l-5.129-4.109a.748.748 0 0 0-.938 0l-5.128 4.108V4.12c0-.352.286-.638.638-.638h9.918a.64.64 0 0 1 .639.638v15.587z"></path></svg>);
    return (
      <img src="http://174.138.40.142/wp-content/prototypes/233/4/en/app_icon_large.png" alt={label} />
    );
  };

  /**
   * CSS styles
   */
  const getRootStyles = () => classNames(
    /* Base app icon styling */
    css.appIconRoot,
    /* Custom class name (extends default class names)
    className,
    /* Icon size */
    css[iconSize],
    /* Icon style (type of icon) */
    css[iconStyle],
    /* Icon has clock event */
    { [css.isClickable]: typeof onClick === 'function' },
    /* No icon - add placeholder styling */
    { [css.noIcon]: !getIcon() },
    /* Active class */
    { [css.isActive]: active },
  );

  /**
   * Element
   */
  const Element = typeof onClick === 'function' ? 'button' : 'span';

  /**
   * Render
   */
  return (
    <Element onClick={onClick} className={getRootStyles()} style={style} title={label}>
      <span className={css.icon}>
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
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.style,
  label: PropTypes.string,
};

AppIcon.defaultProps = {
  iconSize: 'medium',
  iconStyle: 'block',
};

export default AppIcon;
