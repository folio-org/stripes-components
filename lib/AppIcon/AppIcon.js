/**
 * App Icon
 *
 * Used to display an app's icon
 * in various places across the application
 */

import React from 'react';
import PropTypes from 'prop-types';
import { result } from 'lodash';
import classNames from 'classnames';
import css from './AppIcon.css';

const AppIcon = ({ size, icon, style, children, className, tag, app, key }, context) => {
  /**
   * Icon from context
   *
   * We get the icons from the metadata which is passed down via context.
   * The default app icon has a key of "icon".
   * This is required for any app but we'll stll check for it to be sure.
   *
   * If no icon is found we display a placeholder.
   *
   */
  const iconFromMetadataContext = () => {
    const appIcon = result(context, `stripes.metadata.${app}.icons.${key}`);

    if (appIcon && appIcon.src) {
      let src = appIcon.src;

      // Use png's for small app icons
      if (size === 'small' && src.low && src.low.src) {
        src = src.low.src;
      }

      const appIconProps = {
        src,
        alt: appIcon.alt,
        title: appIcon.title,
      };

      return (<img src={appIconProps.src} alt={appIconProps.alt} title={appIconProps.title} {...appIconProps} />);
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

    /* If we have an image passed as an object */
    if (typeof icon === 'object') {
      return (<img src={icon.src} title={icon.title} alt={icon.alt} {...icon} />);
    }

    /* Return formatted icon - or placeholder if no icon was found */
    return iconFromMetadataContext();
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

AppIcon.contextTypes = {
  stripes: PropTypes.shape({
    metadata: PropTypes.object,
  }),
};

AppIcon.propTypes = {
  icon: PropTypes.shape({
    alt: PropTypes.string,
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
  }),
  app: PropTypes.string,
  key: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.object,
  className: PropTypes.string,
  tag: PropTypes.string,
  children: PropTypes.element,
};

AppIcon.defaultProps = {
  size: 'medium',
  tag: 'span',
  key: 'app',
};

export default AppIcon;
