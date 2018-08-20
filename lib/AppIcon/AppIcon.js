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

const AppIcon = ({ size, icon, style, children, className, tag, app, iconKey, stripes }) => {
  /**
   * Icon from context
   *
   * We get the icons from the metadata which is passed down via context.
   * The default app icon has an iconKey of "app".
   *
   * If no icon is found we display a placeholder.
   *
   */
  const iconFromMetadataContext = () => {
    const appIcon = result(stripes, `metadata.${app}.icons.${iconKey}`);
    if (appIcon && appIcon.src) {
      let src = appIcon.src;

      // Use PNGs for small app icons
      if (size === 'small' && appIcon.low && appIcon.low.src) {
        src = appIcon.low.src;
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
      <span className={css.icon}>
        {getIcon()}
      </span>
      { children && <span className={css.label}>{children}</span> }
    </Element>
  );
};

AppIcon.propTypes = {
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
  stripes: PropTypes.shape({
    metadata: PropTypes.object,
  }),
  style: PropTypes.object,
  tag: PropTypes.string,
};

AppIcon.defaultProps = {
  iconKey: 'app',
  size: 'medium',
  tag: 'span',
};

export default withStripes(AppIcon);
