import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import has from 'lodash/has';

import PaneHeaderIconButton from '../PaneHeaderIconButton';
import AppIcon from '../AppIcon';
import PaneMenu from '../PaneMenu';
import { Dropdown } from '../Dropdown';
import DropdownMenu from '../DropdownMenu';
import Icon from '../Icon';
import Button from '../Button';

import css from './PaneHeader.css';

const PaneHeader = ({
  className,
  paneTitle,
  paneSub,
  appIcon,
  actionMenu,
  onClose,
  header,
  firstMenu,
  dismissible,
  paneTitleAutoFocus,
  paneTitleRef,
  lastMenu,
  id
}) => {
  const _id = `paneHeader${id}`;
  const hasActionMenu = typeof actionMenu === 'function' && actionMenu({
    onToggle: () => undefined
  });

  /**
   * Get dismissible button
   */
  const renderDismissibleButton = () => (
    <FormattedMessage
      key="close-pane"
      id="stripes-components.closeItem"
      values={{ item: typeof paneTitle === 'string' ? paneTitle : '' }}
    >
      {ariaLabel => (
        <PaneHeaderIconButton
          data-test-pane-header-dismiss-button
          icon="times"
          onClick={onClose}
          className={css.paneHeaderCloseIcon}
          ariaLabel={ariaLabel}
        />
      )}
    </FormattedMessage>
  );

  /**
   * Action Menu
   */

  // eslint-disable-next-line react/prop-types
  const renderActionMenuToggle = ({ onToggle, triggerRef, keyHandler, open, ariaProps, getTriggerProps }) => (
    <Button
      data-test-pane-header-actions-button
      buttonClass={css.actionMenuToggle}
      buttonStyle="primary"
      marginBottom0
      onClick={onToggle}
      onKeyDown={keyHandler}
      ref={triggerRef}
      type="button"
      {...getTriggerProps()}
      {...ariaProps}
    >
      <Icon icon={open ? 'triangle-up' : 'triangle-down'} iconPosition="end">
        <FormattedMessage id="stripes-components.paneMenuActionsToggleLabel" />
      </Icon>
    </Button>
  );

  // eslint-disable-next-line react/prop-types
  const renderActionMenuContent = ({ onToggle, open, keyHandler }) => (
    <DropdownMenu>
      {actionMenu({ onToggle, open, keyHandler })}
    </DropdownMenu>
  );

  const renderActionMenu = () => (
    <Dropdown
      data-pane-header-actions-dropdown
      key="action-menu-toggle"
      hasPadding
      renderTrigger={renderActionMenuToggle}
      renderMenu={renderActionMenuContent}
    />
  );

  /**
   * App Icon
   */
  const renderAppIcon = () => {
    if (!appIcon) {
      return null;
    }

    /**
     * Old way
     * (Soon to be deprecated)
     */
    if (has(appIcon, 'app')) {
      return (
        <AppIcon
          iconAriaHidden
          size="small"
          app={appIcon.app}
          appIconKey={appIcon.key}
        />
      );
    }

    return React.cloneElement(appIcon, {
      size: 'small',
      iconAriaHidden: true,
      tag: 'div',
    });
  };

  /**
   * Get the centered content
   */
  const getCenteredContentArea = () => (
    <div className={css.paneHeaderCenter}>
      <div
        className={css.paneHeaderCenterInner}
        id={`${_id}-pane-title`}
      >
        { paneTitle && (
        <h2 data-test-pane-header-title className={css.paneTitle}>
          { renderAppIcon() }
          <span className={css.paneTitleLabel}>
            {paneTitle}
          </span>
        </h2>
        )}
        { paneSub && (
          <p
            data-test-pane-header-sub
            id={`${_id}-subtitle`}
            className={css.paneSub}
          >
            <span>{paneSub}</span>
          </p>
        )}
      </div>
    </div>
  );

  /**
   * Get content area default
   */
  const getContentArea = (placement, menuElement, hasDismissibleIcon) => {
    // Don't add the first content area if there is nothing to show
    if (!hasDismissibleIcon && !menuElement && !hasActionMenu) {
      return false;
    }

    // Default content to provided menuElement or empty <PaneMenu> if none is provided
    let content = menuElement || <PaneMenu />;

    // If a dismissible buton is activated we merge this into the menuElement
    if (hasDismissibleIcon) {
      content = React.cloneElement(
        content,
        {},
        [renderDismissibleButton()].concat(React.Children.toArray(content.props.children))
      );
    }

    // Prepend action menu dropdown toggle if we have an action menu to show
    if (hasActionMenu && placement === 'last') {
      content = React.cloneElement(
        content,
        {},
        [renderActionMenu()].concat(React.Children.toArray(content.props.children))
      );
    }

    return (
      <div className={classnames(css.paneHeaderButtonsArea, css[placement])}>
        { content }
      </div>
    );
  };

  /**
   * If a custom header is supplied we return that instead
   * (Disrecards all behavior of default header)
   */
  if (header) {
    return (<div data-test-pane-header-custom className={css.paneHeader}>{header}</div>);
  }

  /**
   * App can obtain a ref to the pane header for focus management (paneTitleRef).
   * The header is labeled by the title which will announce on focus.
   * This focus can only be achieved programmatically.
   */
  return (
    <div
      data-test-pane-header
      id={_id}
      className={classnames(css.paneHeader, className)}
      autoFocus={paneTitleAutoFocus}
      tabIndex="-1"
      ref={paneTitleRef}
      aria-labelledby={`${_id}-pane-title`}
    >
      { getContentArea('first', firstMenu, (dismissible === true || dismissible === 'first')) }
      { getCenteredContentArea() }
      { getContentArea('last', lastMenu, dismissible === 'last') }
    </div>
  );
};

PaneHeader.propTypes = {
  actionMenu: PropTypes.func,
  appIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.element]),
  className: PropTypes.string,
  dismissible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  firstMenu: PropTypes.element,
  header: PropTypes.element,
  id: PropTypes.string,
  lastMenu: PropTypes.element,
  onClose: PropTypes.func,
  paneSub: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]),
  paneTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]),
  paneTitleAutoFocus: PropTypes.bool,
  paneTitleRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};

export default PaneHeader;
