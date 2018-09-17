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
import { withStripes } from '@folio/stripes-core/src/StripesContext';
import css from './AppIcon.css';

const AppIcon = ({ size, icon, alt, title, src, style, children, className, tag, app, iconKey, stripes }) => {
  const getIcon = () => {
    let appIconProps;

    /**
     * Icon from context
     *
     * We get the icons from the metadata which is passed down via context.
     * The default app icon has an iconKey of "app".
     *
     * If no icon is found we display a placeholder.
     *
     */
    const appIcon = result(stripes, `metadata.${app}.icons.${iconKey}`);
    if (appIcon && appIcon.src) {
      appIconProps = {
        src: appIcon.src,
        alt: appIcon.alt,
        title: appIcon.title,
      };

      // Use PNGs (if available) for small app icons on non-retina screens
      const isRetina = window.matchMedia(`
        (-webkit-min-device-pixel-ratio: 2), 
        (min-device-pixel-ratio: 2), 
        (min-resolution: 192dpi)
      `).matches;

      // Ignoring next block in tests since it can't be tested consistently
      // istanbul ignore next
      if (!isRetina && size === 'small' && appIcon.low && appIcon.low.src) {
        appIconProps.src = appIcon.low.src;
      }
    }

    /* If we have an image passed as an object */
    if (typeof icon === 'object') {
      appIconProps = {
        src: icon.src,
        alt: icon.alt,
        title: icon.title,
      };
    }

    // No image props - return nothing and the placeholder will be active
    if (!appIconProps) {
      return null;
    }

    return (
      <img
        src={typeof src !== 'undefined' ? src : appIconProps.src}
        alt={typeof alt !== 'undefined' ? alt : appIconProps.alt}
        title={typeof title !== 'undefined' ? title : appIconProps.title}
      />
    );
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
      <span className={css.icon}>
        {getIcon()}
      </span>
      { children && <span className={css.label}>{children}</span> }
    </Element>
  );
};

AppIcon.propTypes = {
  alt: PropTypes.string,
  app: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.shape({
    alt: PropTypes.string,
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
  }),
  iconKey: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  src: PropTypes.string,
  stripes: PropTypes.shape({
    metadata: PropTypes.object,
  }),
  style: PropTypes.object,
  tag: PropTypes.string,
  title: PropTypes.string,
};

AppIcon.defaultProps = {
  iconKey: 'app',
  size: 'medium',
  tag: 'span',
};

export default withStripes(AppIcon);
