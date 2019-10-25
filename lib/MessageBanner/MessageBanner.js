/**
 * MessageBanner
 */

import React, { forwardRef, useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import IconButton from '../IconButton';
import Icon from '../Icon';
import css from './MessageBanner.module.css';

export const TYPES = {
  DEFAULT: 'default',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
};

const MessageBanner = forwardRef(
  (
    {
      type,
      children,
      className,
      dismissable,
      element: Element,
      icon,
      onExit,
      onExited,
      ...rest
    },
    ref
  ) => {
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);

    const renderIcon = () => {
      let iconName = null;

      if (type === TYPES.SUCCESS) {
        iconName = 'check-circle';
      }

      if (type === TYPES.WARNING || type === TYPES.ERROR) {
        iconName = 'exclamation-circle';
      }

      // Allow custom icon
      if (typeof icon === 'string') {
        iconName = icon;
      }

      if (!iconName) {
        return null;
      }

      return (
        <Icon icon={iconName} className={css.icon} size="small" />
      );
    };

    return (
      <CSSTransition
        in={visible}
        timeout={200}
        unmountOnExit
        onExit={onExit}
        onExited={onExited}
        classNames={{
          enter: css.enter,
          enterActive: css.enterActive,
          exit: css.exit,
          exitActive: css.exitActive,
        }}
      >
        <Element
          className={classnames(css.root, css[`type-${type}`], className)}
          ref={ref}
          role="alert"
          {...rest}
        >
          {renderIcon()}
          <div className={css.content}>{children}</div>
          {dismissable && (
            <div className={css.dismissButtonWrap}>
              <IconButton
                className={css.dismissButton}
                size="small"
                onClick={onDismiss}
                icon="times"
              />
            </div>
          )}
        </Element>
      </CSSTransition>
    );
  }
);

MessageBanner.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  element: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
  type: PropTypes.oneOf(Object.keys(TYPES).map(key => TYPES[key])),
};

MessageBanner.defaultProps = {
  type: TYPES.DEFAULT,
  element: 'div',
};

MessageBanner.displayName = 'MessageBanner';

export default MessageBanner;
