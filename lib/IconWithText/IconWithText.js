/**
 * IconWithText
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './IconWithText.css';

import Icon from '../Icon';
import AppIcon from '../AppIcon';

const IconWithText = ({ text, app, icon }) => {
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

  return (
    <div className={css.iconWithText}>
      {renderIcon()}
      <span className={css.text}>{text}</span>
    </div>
  );
};

IconWithText.propTypes = {
  app: PropTypes.string,
  icon: PropTypes.string,
  text: PropTypes.node,
};

export default IconWithText;
