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

const AppIcon = ({ size, icon, style, children, className, tag }) => {
  /**
   * Formatted Icon

   ** Work in progress **
    Here we determine what to return
   from a icon object once this is in place
   It's getting discussed here: https://issues.folio.org/browse/STCOR-117 */
  const formattedIcon = () => {
    /* Only setting this if statement to avoid linting error */
    if (icon) {
      return icon;
    }
    return null;
  };

  /**
   * Return icon or placeholder
   */
  const getIcon = () => {
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
    css.appIcon,
    /* Icon size */
    css[size],
    /* Custom ClassName */
    className,
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
      {getIcon()}
    </Element>
  );
};

AppIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.object,
  className: PropTypes.string,
  tag: PropTypes.string,
  children: PropTypes.element,
};

AppIcon.defaultProps = {
  size: 'medium',
  tag: 'span',
};

export default AppIcon;
