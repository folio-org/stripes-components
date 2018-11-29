import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { deprecated } from 'prop-types-extra';
import classNames from 'classnames';

import css from './PaneHeader.css';
import IconButton from '../IconButton';
import { Dropdown } from '../Dropdown';
import DropdownMenu from '../DropdownMenu';
import NavList from '../NavList';
import NavListSection from '../NavListSection';
import NavListItem from '../NavListItem';
import Icon from '../Icon';
import AppIcon from '../AppIcon';

class PaneHeader extends Component {
  static propTypes = {
    actionMenu: PropTypes.func,
    actionMenuItems: deprecated(PropTypes.arrayOf(PropTypes.object), 'Use `actionMenu` instead.'),
    appIcon: PropTypes.shape({
      app: PropTypes.string.isRequired,
      key: PropTypes.string,
    }),
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
  }

  constructor(props) {
    super(props);

    this.state = {
      centerMargin: null,
      actionMenuOpen: false,
    };

    this.getCenteredContentArea = this.getCenteredContentArea.bind(this);
    this.getDismissibleButton = this.getDismissibleButton.bind(this);
    this.getContentArea = this.getContentArea.bind(this);
    this.getFirstContentArea = this.getFirstContentArea.bind(this);
    this.getLastContentArea = this.getLastContentArea.bind(this);
    this.setCenteredMargin = this.setCenteredMargin.bind(this);
    this.getActionMenu = this.getActionMenu.bind(this);
    this.toggleActionMenu = this.toggleActionMenu.bind(this);

    this._id = `paneHeader${this.props.id}`;
  }

  componentDidMount() {
    this.setCenteredMargin();
  }

  /**
   * Set horizontal margin on centered content area
   * The centered content is absolute to make sure that the content
   * is always centered in the header - no matter what content there is to the left and right.
   * We add margin so that the centered content won't overflow the menu areas.
   */
  setCenteredMargin() {
    const { firstAreaElement, lastAreaElement } = this;
    const firstWidth = firstAreaElement ? firstAreaElement.offsetWidth : 0;
    const lastWidth = lastAreaElement ? lastAreaElement.offsetWidth : 0;

    if (firstWidth || lastWidth) {
      this.setState({
        centerMargin: `0px ${firstWidth >= lastWidth ? firstWidth : lastWidth}px`,
      });
    }
  }

  /**
   * Get dismissible button
   */
  getDismissibleButton() {
    const { onClose, paneTitle } = this.props;

    let description = '';
    if (typeof paneTitle === 'string') {
      description = paneTitle;
    }

    return (
      <FormattedMessage id="stripes-components.closeItem" values={{ item: description }}>
        {ariaLabel => (
          <IconButton
            key="close-pane"
            icon="times"
            onClick={onClose}
            className={css.paneHeaderCloseIcon}
            aria-label={ariaLabel}
          />
        )}
      </FormattedMessage>
    );
  }

  /**
   * Get center content area style
   */
  getCenteredContentAreaStyle() {
    const { centerMargin } = this.state;
    if (!centerMargin) {
      return null;
    }
    return {
      margin: centerMargin,
    };
  }

  /**
   * Get Action Menu
   */
  getActionMenu() {
    const { actionMenuItems, actionMenu } = this.props;

    /**
     * Pass action menu content as function
     */
    if (typeof actionMenu === 'function') {
      const actionMenuProps = {
        onToggle: this.toggleActionMenu,
      };
      return actionMenu(actionMenuProps);
    }

    /**
     * Action menu items passed as array of objects
     * (Deprecation in progress)
     */
    if (actionMenuItems && actionMenuItems.length) {
      return (
        <NavList>
          <NavListSection activeLink="">
            {
              actionMenuItems.map((item, index) => {
                const { label, onClick, ...rest } = item;

                const click = e => {
                  // Close menu on click
                  this.toggleActionMenu();

                  // Fire onClick if defined
                  // (NavListItem supports to/href as well as onClick)
                  if (typeof onClick === 'function') {
                    onClick(e);
                  }
                };

                return (
                  <NavListItem {...rest} onClick={click} key={index}>{label}</NavListItem>
                );
              })
            }
          </NavListSection>
        </NavList>
      );
    }

    return null;
  }

  /**
   * Toggle Pane Menu
   */
  toggleActionMenu() {
    this.setState(prevState => ({ actionMenuOpen: !prevState.actionMenuOpen }));
  }

  /**
   * Get the centered content
   */
  getCenteredContentArea() {
    const { getActionMenu, toggleActionMenu } = this;
    const { paneTitle, paneSub, appIcon } = this.props;
    const { actionMenuOpen } = this.state;
    const paneActionMenu = getActionMenu();

    const content = (
      <div>
        { paneTitle && (
          <h2 className={css.paneTitle} aria-describedby={paneSub && `${this._id}-subtitle`}>
            { appIcon &&
              <AppIcon iconAriaHidden size="small" app={appIcon.app} appIconKey={appIcon.key} />
            }
            <span
              tabIndex="-1"
              ref={this.props.paneTitleRef}
              autoFocus={this.props.paneTitleAutoFocus}
              className={css.paneTitleLabel}
            >
              {paneTitle}
            </span>
            { paneActionMenu &&
              <Icon
                icon={actionMenuOpen ? 'caret-up' : 'caret-down'}
                size="small"
                iconRootClass={css.paneActionMenuIcon}
              />
            }
          </h2>
        )
        }
        { paneSub && (
          <p id={`${this._id}-subtitle`} className={css.paneSub}><span>{paneSub}</span></p>
        ) }
      </div>
    );
    /**
     * Action Menu
     */

    const contentWithActionMenu = (
      <Dropdown
        open={actionMenuOpen}
        onToggle={toggleActionMenu}
        hasPadding
      >
        <button
          data-role="toggle"
          className={css.paneHeaderCenterButton}
          type="button"
        >
          { content }
        </button>
        <DropdownMenu
          data-role="menu"
          onToggle={toggleActionMenu}
        >
          {paneActionMenu}
        </DropdownMenu>
      </Dropdown>
    );

    return (
      <div className={css.paneHeaderCenter} style={this.getCenteredContentAreaStyle()}>
        <div className={css.paneHeaderCenterInner}>
          { paneActionMenu ? contentWithActionMenu : content }
        </div>
      </div>
    );
  }


  /**
   * Get content area default
   */
  getContentArea(placement, menuElement, className, hasDismissibleIcon) {
    const { getDismissibleButton } = this;
    const classes = classNames(className);

    /* Default content to provided menuElement */
    let content = menuElement;

    /* Don't add the first content area if there is nothing to show */
    if (!hasDismissibleIcon && !menuElement) {
      return false;
    }

    /* If we have a dismissible icon but no menuElement */
    if (hasDismissibleIcon && !menuElement) {
      content = getDismissibleButton();
    }

    /* If a dismissible button is required
    and we have a menu element we merge that with the menu content */
    if (hasDismissibleIcon && menuElement) {
      content = React.cloneElement(
        menuElement,
        {},
        [getDismissibleButton()].concat(React.Children.toArray(menuElement.props.children))
      );
    }

    return (
      <div className={classes} ref={(el) => { this[`${placement}AreaElement`] = el; }}>
        { content }
      </div>
    );
  }

  /**
   * Get first content area
   */
  getFirstContentArea() {
    const { firstMenu, dismissible } = this.props;
    const hasDismissibleIcon = dismissible === true || dismissible === 'first';
    return this.getContentArea('first', firstMenu, css.paneContentFirstArea, hasDismissibleIcon);
  }

  /**
   * Get last content area
   */
  getLastContentArea() {
    const { lastMenu, dismissible } = this.props;
    const hasDismissibleIcon = dismissible === 'last';
    return this.getContentArea('last', lastMenu, css.paneContentLastArea, hasDismissibleIcon);
  }

  render() {
    const { getCenteredContentArea, getFirstContentArea, getLastContentArea } = this;
    const { header } = this.props;

    /**
     * If a custom header is supplied we return that instead
     * (Disrecards all behavior of default header)
     */

    if (header) {
      return (<div className={css.paneHeader}>{header}</div>);
    }

    return (
      <div className={css.paneHeader}>
        { getFirstContentArea() }
        { getCenteredContentArea() }
        { getLastContentArea() }
      </div>
    );
  }
}

export default PaneHeader;
