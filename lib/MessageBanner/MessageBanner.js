/**
 * MessageBanner
 */

import React, { forwardRef, useState, useEffect } from 'react';
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
      children,
      className,
      dismissable,
      element: Element,
      icon,
      onEnter,
      onEntered,
      onExit,
      onExited,
      show,
      type,
      ...rest
    },
    ref
  ) => {
    const [visible, setVisible] = useState(show);
    const onDismiss = () => setVisible(false);

    useEffect(() => {
      setVisible(show);
    }, [show]);

    const renderIcon = () => {
      let iconName = null;

      if (type === TYPES.SUCCESS) {
        iconName = 'check-circle';
      }

      if (type === TYPES.WARNING || type === TYPES.ERROR) {
        iconName = 'exclamation-circle';
      }

      // Allow custom icon
      if (typeof icon === 'string' || icon === null) {
        iconName = icon;
      }

      if (!iconName) {
        return null;
      }

      return (
        <Icon
          icon={iconName}
          iconRootClass={css.icon}
          size="medium"
        />
      );
    };

    return (
      <CSSTransition
        in={visible}
        timeout={200}
        unmountOnExit
        onExit={onExit}
        onExited={onExited}
        onEnter={onEnter}
        onEntered={onEntered}
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
                size="medium"
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
  dismissable: PropTypes.bool,
  element: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
  icon: PropTypes.string,
  onExit: PropTypes.func,
  onExited: PropTypes.func,
  show: PropTypes.bool,
  type: PropTypes.oneOf(Object.keys(TYPES).map(key => TYPES[key])),
};

MessageBanner.defaultProps = {
  type: TYPES.DEFAULT,
  show: true,
  element: 'div',
};

MessageBanner.displayName = 'MessageBanner';

export default MessageBanner;
