/**
 * MessageBanner
 */

import React, { forwardRef, useState, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
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

export const DEFAULT_ICONS = {
  SUCCESS: 'check-circle',
  ERROR: 'exclamation-circle',
  WARNING: 'exclamation-circle',
};

const MessageBanner = forwardRef(
  (
    {
      'aria-live': ariaLive = 'assertive',
      autoFocusDismissButton = false,
      children,
      className,
      contentClassName,
      dismissible,
      dismissButtonAriaLabel,
      dismissButtonProps = {},
      element: Element = 'div',
      icon,
      onEnter,
      onEntered,
      onExit,
      onExited,
      show = true,
      type = TYPES.DEFAULT,
      marginTop0 = false,
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
      let iconName = typeof type === 'string' && DEFAULT_ICONS[type.toUpperCase()];

      // Allow custom icon and disabling icon by setting it to null
      if (typeof icon === 'string' || icon === null) {
        iconName = icon;
      }

      if (!iconName) {
        return null;
      }

      return (
        <Icon
          data-test-message-dismiss-button
          icon={iconName}
          iconRootClass={css.icon}
          size="medium"
        />
      );
    };

    const getMessageBannerClass = () => classnames(
      css.root,
      { [css.marginTop0]: marginTop0 },
    );

    return (
      <div role="alert" aria-live={ariaLive} className={getMessageBannerClass()}>
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
            data-test-message-banner
            className={
              classnames(
                css.inner,
                css[`type-${type}`],
                className
              )
            }
            ref={ref}
            {...rest}
          >
            {renderIcon()}
            <div className={classnames(css.content, contentClassName)}>{children}</div>
            {(dismissible) && (
              <div className={css.dismissButtonWrap}>
                <FormattedMessage id="stripes-components.MessageBanner.dismissButtonAriaLabel">
                  { ([dismissAriaLabel]) => (
                    <IconButton
                      data-test-message-dismiss-button
                      className={classnames(css.dismissButton, get(dismissButtonProps, 'className'))}
                      size="medium"
                      onClick={onDismiss}
                      icon="times"
                      aria-label={dismissButtonAriaLabel || dismissAriaLabel}
                      autoFocus={autoFocusDismissButton}
                      {...dismissButtonProps}
                    />
                  ) }
                </FormattedMessage>
              </div>
            )}
          </Element>
        </CSSTransition>
      </div>
    );
  }
);

MessageBanner.propTypes = {
  'aria-live': PropTypes.oneOf(['off', 'polite', 'assertive']),
  autoFocusDismissButton: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  dismissButtonAriaLabel: PropTypes.string,
  dismissButtonProps: PropTypes.object,
  dismissible: PropTypes.bool,
  element: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
  icon: PropTypes.string,
  onEnter: PropTypes.func,
  onEntered: PropTypes.func,
  onExit: PropTypes.func,
  onExited: PropTypes.func,
  show: PropTypes.bool,
  type: PropTypes.oneOf(Object.keys(TYPES).map(key => TYPES[key])),
  marginTop0: PropTypes.bool,
};

MessageBanner.displayName = 'MessageBanner';

export default MessageBanner;
