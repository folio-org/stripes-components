import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './PaneHeader.css';
import IconButton from '../IconButton';
import { Dropdown } from '../Dropdown';
import DropdownMenu from '../DropdownMenu';
import NavList from '../NavList';
import NavListSection from '../NavListSection';
import Icon from '../Icon';
import AppIcon from '../AppIcon';

export default class PaneHeader extends Component {
  static propTypes = {
    firstMenu: PropTypes.element,
    lastMenu: PropTypes.element,
    actionMenuItems: PropTypes.arrayOf(PropTypes.object),
    header: PropTypes.element,
    paneTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]),
    paneSub: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]),
    onClose: PropTypes.func,
    dismissible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    appIcon: PropTypes.shape({
      app: PropTypes.string.isRequired,
      key: PropTypes.string,
    }),
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
      <IconButton
        key="close-pane"
        icon="closeX"
        onClick={onClose}
        title="Close pane"
        className={css.paneHeaderCloseIcon}
        ariaLabel={`Close ${description}`}
      />
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
    const { actionMenuItems } = this.props;

    if (!actionMenuItems || !actionMenuItems.length) {
      return false;
    }

    return (
      <NavList>
        <NavListSection activeLink="">
          {
           actionMenuItems.map((item, index) => {
             const { label, ...rest } = item;

             let Element = 'button';
             if (item.to) { Element = Link; }
             if (item.href) { Element = 'a'; }

             return (
               <Element key={index} {...rest}>
                 {label}
               </Element>
             );
           })
         }
        </NavListSection>
      </NavList>
    );
  }

  /**
   * Get the centered content
   */
  getCenteredContentArea() {
    const paneActionMenu = this.getActionMenu();
    const { paneTitle, paneSub, appIcon } = this.props;
    const { actionMenuOpen } = this.state;

    const content = (
      <div>
        { paneTitle && (
          <h2 title={paneTitle} className={css.paneTitle}>
            { appIcon && <AppIcon size="small" app={appIcon.app} appIconKey={appIcon.key} /> }
            <span className={css.paneTitleLabel}>{paneTitle}</span>
            { paneActionMenu && <Icon icon={actionMenuOpen ? 'down-caret' : 'up-caret'} size="small" iconRootClass={css.paneActionMenuIcon} />}
          </h2>
          )
        }
        { paneSub && (<p title={paneSub} className={css.paneSub}><span>{paneSub}</span></p>) }
      </div>
    );
    /**
     * Action Menu
     */

    const toggleActionMenu = () => {
      this.setState({ actionMenuOpen: !actionMenuOpen });
    };

    const contentWithActionMenu = (
      <Dropdown
        open={actionMenuOpen}
        onToggle={toggleActionMenu}
        hasPadding
      >
        <button data-role="toggle" className={css.paneHeaderCenterButton}>
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
      content = React.cloneElement(menuElement, {}, [getDismissibleButton()].concat(React.Children.toArray(menuElement.props.children)));
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
