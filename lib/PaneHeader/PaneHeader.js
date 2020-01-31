import React, { Component } from 'react';
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

import css from './PaneHeader.css';

class PaneHeader extends Component {
  static propTypes = {
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

  constructor(props) {
    super(props);

    this.state = {
      centerMargin: null,
    };

    this._id = `paneHeader${this.props.id}`;

    this.firstPaneButtonsArea = React.createRef();
    this.lastPaneButtonsArea = React.createRef();
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
    const firstWidth = this.firstPaneButtonsArea.current ? this.firstPaneButtonsArea.current.offsetWidth + 10 : 0;
    const lastWidth = this.lastPaneButtonsArea.current ? this.lastPaneButtonsArea.current.offsetWidth + 10 : 0;

    if (firstWidth || lastWidth) {
      this.setState({
        centerMargin: `0px ${firstWidth >= lastWidth ? firstWidth : lastWidth}px`,
      });
    }
  }

  /**
   * Get dismissible button
   */
  getDismissibleButton = () => {
    const { onClose, paneTitle } = this.props;

    let description = '';
    if (typeof paneTitle === 'string') {
      description = paneTitle;
    }

    return (
      <FormattedMessage
        key="close-pane"
        id="stripes-components.closeItem"
        values={{ item: description }}
      >
        {ariaLabel => (
          <PaneHeaderIconButton
            icon="times"
            onClick={onClose}
            className={css.paneHeaderCloseIcon}
            aria-label={ariaLabel}
          />
        )}
      </FormattedMessage>
    );
  };

  /**
   * Get center content area style
   */
  getCenteredContentAreaStyle = () => {
    const { centerMargin } = this.state;
    if (!centerMargin) {
      return null;
    }
    return {
      margin: centerMargin,
    };
  };

  /**
   * App Icon
   */
  renderAppIcon = () => {
    const { appIcon } = this.props;

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

  renderActionDDTrigger = ({ getTriggerProps, open }) => (
    <button
      className={css.paneHeaderCenterButton}
      type="button"
      {...getTriggerProps()}
    >
      {this.getContent(open)}
    </button>
  );

  renderActionDDMenu = ({ onToggle, open, keyHandler }) => {
    const { actionMenu } = this.props;
    return (
      <DropdownMenu>
        {actionMenu({ onToggle, open, keyHandler })}
      </DropdownMenu>
    );
  }

  getContent = (open) => {
    const { paneTitle, paneSub } = this.props;
    return (
      <React.Fragment>
        { paneTitle && (
        <h2 className={css.paneTitle}>
          { this.renderAppIcon() }
          <span className={css.paneTitleLabel}>
            {paneTitle}
          </span>
          { open !== undefined &&
            <Icon
              icon={open ? 'caret-up' : 'caret-down'}
              size="small"
              iconRootClass={css.paneActionMenuIcon}
            />
          }
        </h2>
        )}
        { paneSub && (
          <p id={`${this._id}-subtitle`} className={css.paneSub}><span>{paneSub}</span></p>
        )}
      </React.Fragment>
    );
  }

  getActionMenu = () => (
    <Dropdown
      hasPadding
      renderTrigger={this.renderActionDDTrigger}
      renderMenu={this.renderActionDDMenu}
    />
  );

  /**
   * Get the centered content
   */
  getCenteredContentArea = () => {
    const { actionMenu } = this.props;

    return (
      <div className={css.paneHeaderCenter} style={this.getCenteredContentAreaStyle()}>
        <div
          className={css.paneHeaderCenterInner}
          id={`${this._id}-pane-title`}
        >
          { actionMenu ? this.getActionMenu() : this.getContent() }
        </div>
      </div>
    );
  };


  /**
   * Get content area default
   */
  getContentArea(placement, menuElement, hasDismissibleIcon) {
    const { getDismissibleButton } = this;

    // Don't add the first content area if there is nothing to show
    if (!hasDismissibleIcon && !menuElement) {
      return false;
    }

    // Default content to provided menuElement or empty <PaneMenu> if none is provided
    let content = menuElement || <PaneMenu />;

    // If a dismissible buton is activated we merge this into the menuElement
    if (hasDismissibleIcon) {
      content = React.cloneElement(
        content,
        {},
        [getDismissibleButton()].concat(React.Children.toArray(content.props.children))
      );
    }

    return (
      <div
        className={classnames(css.paneHeaderButtonsArea, css[placement])}
        ref={this[`${placement}PaneButtonsArea`]}
      >
        { content }
      </div>
    );
  }

  /**
   * Get first content area
   */
  getFirstContentArea = () => {
    const { firstMenu, dismissible } = this.props;
    const hasDismissibleIcon = dismissible === true || dismissible === 'first';
    return this.getContentArea('first', firstMenu, hasDismissibleIcon);
  };

  /**
   * Get last content area
   */
  getLastContentArea = () => {
    const { lastMenu, dismissible } = this.props;
    const hasDismissibleIcon = dismissible === 'last';
    return this.getContentArea('last', lastMenu, hasDismissibleIcon);
  };

  render() {
    const { getCenteredContentArea, getFirstContentArea, getLastContentArea } = this;
    const { header, className } = this.props;

    /**
     * If a custom header is supplied we return that instead
     * (Disrecards all behavior of default header)
     */

    if (header) {
      return (<div className={css.paneHeader}>{header}</div>);
    }

    /**
     * App can obtain a ref to the pane header for focus management (paneTitleRef).
     * The header is labeled by the title which will announce on focus.
     * This focus can only be achieved programmatically.
     */

    return (
      <div
        data-test-pane-header
        className={classnames(css.paneHeader, className)}
        autoFocus={this.props.paneTitleAutoFocus}
        tabIndex="-1"
        ref={this.props.paneTitleRef}
        aria-labelledby={`${this._id}-pane-title`}
      >
        { getFirstContentArea() }
        { getCenteredContentArea() }
        { getLastContentArea() }
      </div>
    );
  }
}

export default PaneHeader;
