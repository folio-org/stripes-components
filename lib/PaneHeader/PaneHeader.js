import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './PaneHeader.css';
import { IconButton } from '../Button';

export default class PaneHeader extends Component {
  static propTypes = {
    firstMenu: PropTypes.element,
    lastMenu: PropTypes.element,
    header: PropTypes.element,
    paneTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    paneSub: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    onClose: PropTypes.func,
    dismissible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }

  constructor(props) {
    super(props);

    this.state = {
      centerMargin: null,
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
   * Get the centered content
   */
  getCenteredContentArea() {
    const { paneTitle, paneSub } = this.props;
    return (
      <section className={css.paneHeaderCenter} style={this.getCenteredContentAreaStyle()}>
        <div className={css.paneHeaderCenterInner}>
          { paneTitle && (<h3 title={paneTitle} className={css.paneTitle}>{paneTitle}</h3>) }
          { paneSub && (<p title={paneSub} className={css.paneSub}>{paneSub}</p>) }
        </div>
      </section>
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

    if (menuElement) {
      console.log('menuElement.props.children', menuElement);
    }

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
      <section className={classes} ref={(el) => { this[`${placement}AreaElement`] = el; }}>
        { content }
      </section>
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
      return (<header className={css.paneHeader}>{header}</header>);
    }

    return (
      <header className={css.paneHeader}>
        { getFirstContentArea() }
        { getCenteredContentArea() }
        { getLastContentArea() }
      </header>
    );
  }
}
