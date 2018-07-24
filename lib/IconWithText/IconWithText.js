/**
 * IconWithText
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import camelCase from 'lodash/camelCase';
import css from './IconWithText.css';
import Icon from '../Icon';
import AppIcon from '../AppIcon';

const IconWithText = ({
  text,
  app,
  icon,
  id,
  className,
  iconPlacement,
  padding,
  block,
  ...rest
}) => {
  const renderIcon = () => {
    // Render AppIcon if the app key is specified
    if (app) {
      return (
        <AppIcon
          className={classnames(css.icon, css.appIcon)}
          app={app}
          iconKey={icon}
          size="small"
        />
      );
    // Else render regular Icon
    } else {
      return (
        <Icon
          iconRootClass={classnames(css.icon, css.regularIcon)}
          icon={icon}
          size="small"
        />
      );
    }
  };

  const rootClasses = classnames(
    css.iconWithText,
    className,
    css[camelCase(`icon placement ${iconPlacement}`)],
    { [css[`padding-${padding}`]]: padding },
    { [css.block]: block },
  );

  return (
    <div className={rootClasses} id={id} {...rest}>
      {renderIcon()}
      <span className={css.text}>{text}</span>
    </div>
  );
};

IconWithText.defaultProps = {
  iconPlacement: 'start',
};

IconWithText.propTypes = {
  app: PropTypes.string,
  block: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.string,
  iconPlacement: PropTypes.oneOf(['start', 'end']),
  id: PropTypes.string,
  padding: PropTypes.oneOf(['start', 'end', 'both']),
  text: PropTypes.node,
};

export default IconWithText;
