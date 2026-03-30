// @ts-nocheck
import React from "react";
import classNames from "classnames";
import uniqueId from "lodash/uniqueId";
import css from "./Pane.css";
import PaneHeader from "../PaneHeader";
import { withPaneset } from "../Paneset/PanesetContext";
import { withResize } from "../Paneset/ResizeContext";
import { FOCUSABLE_SELECTOR } from "../../util/getFocusableElements";
type PaneProps = {
  actionMenu?: (...args: any[]) => any;
  actionMenuAutoFocus?: boolean;
  appIcon?: Record<string, any> | React.ReactElement;
  centerContent?: boolean;
  children?: React.ReactNode;
  defaultWidth: string;
  dismissible?: boolean | string;
  firstMenu?: React.ReactElement;
  fluidContentWidth?: boolean;
  footer?: React.ReactElement;
  height?: string;
  id?: string;
  lastMenu?: React.ReactElement;
  noOverflow?: boolean;
  onClose?: (...args: any[]) => any;
  onMount?: (...args: any[]) => any;
  padContent?: boolean;
  paneset?: {
    handleClose?: (...args: any[]) => any;
    registerPane?: (...args: any[]) => any;
    removePane?: (...args: any[]) => any;
  };
  paneSub?: string | React.ReactElement;
  paneTitle?: string | React.ReactElement;
  paneTitleRef?: Record<string, any> | ((...args: any[]) => any);
  renderHeader?: (...args: any[]) => any;
  resizer?: {
    registerHandle?: (...args: any[]) => any;
    removeHandle?: (...args: any[]) => any;
    updateHandle?: (...args: any[]) => any;
  };
  subheader?: React.ReactNode;
  tagName?: string;
  transition?: string;
};

const defaultProps = {
  centerContent: false,
  padContent: true,
  tagName: "section",
  transition: "none",
  renderHeader: (props) => <PaneHeader {...props} />,
};

class Pane extends React.Component<PaneProps> {
  constructor(props) {
    super(props);

    let initStyle = {};
    if (this.props.defaultWidth !== "fill") {
      initStyle = Object.assign(initStyle, {
        flex: `0 0 ${this.props.defaultWidth}`,
      });
    }
    if (this.props.height) {
      initStyle = Object.assign(initStyle, { height: `${this.props.height}` });
    }
    this.state = {
      style: initStyle,
      contentMinWidth: 0, // eslint-disable-line react/no-unused-state
    };

    this.id = props.id || uniqueId();
    this.resizeId = uniqueId("resize");
    this.contentMinWidth = 0;
    this._isMounted = false;
    this._lastFocusedChild = null;
    this.el = React.createRef();
    this.contentWrapperEl = React.createRef();

    /**
     * App Icon warning
     * (will be removed later)
     */
    const { appIcon } = this.props;
    if (typeof appIcon === "object" && typeof appIcon.app === "string") {
      console.warn(`
        [DEPRECATION] Pass an <AppIcon> (from stripes-core)
        to the appIcon-prop on <Pane> instead of an object.
      `);
    }
  }

  componentDidMount() {
    const {
      transition,
      defaultWidth,
      paneset,
      resizer,
      paneTitleRef,
      onMount,
      id,
    } = this.props;
    const paneObject = {
      transition,
      setStyle: this.setStyle,
      isThisMounted: this.isThisMounted,
      defaultWidth,
      id: this.id,
      // whether or not the pane had to generate its id.
      // This is used to determine whether the size of the panes should be cached.
      hasGeneratedId: !id,
      getRef: this.getRef,
    };
    if (paneset) {
      paneset.registerPane(paneObject);
    }
    if (resizer) {
      resizer.registerHandle({
        id: this.resizeId,
        elementId: this.id,
        getRef: this.getRef,
      });
    }
    this.animationCallbackID = window.requestAnimationFrame(() => {
      this.setState({ contentMinWidth: this.getContentWidth() }); // eslint-disable-line react/no-unused-state
    });
    this._isMounted = true;

    if (onMount) {
      onMount({
        paneRef: this.el,
        paneTitleRef,
      });
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationCallbackID);
    this._isMounted = false;
    if (this.props.paneset) {
      this.props.paneset.removePane();
    }
    if (this.props.resizer) {
      this.props.resizer.removeHandle(this.resizeId);
    }
  }

  isThisMounted = () => this._isMounted;

  setLatestFocused = (e) => {
    this._lastFocusedChild = e.target;
  };

  getLatestFocused = () => this._lastFocusedChild;

  setStyle = (style) => {
    if (this._isMounted) {
      this.setState(
        (oldState) => {
          const nextState = Object.assign({}, oldState);
          // clone because you can't mutate style....
          const newStyle = Object.assign({}, nextState.style, style);
          nextState.style = newStyle;
          return nextState;
        },
        () => this.props.resizer.updateHandle(this.id),
      );
    }
  };

  getContentWidth = () => {
    if (!this.props.fluidContentWidth) {
      if (this.props.defaultWidth === "fill") {
        return "960px";
      }
      const widthNum = parseInt(this.props.defaultWidth, 10);
      const w = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0,
      );
      const widthCalc = (widthNum / 100) * w - 175;
      return `${widthCalc}px`;
    }
    return "none"; // content should have no minWidth.
  };

  handleClose = () => {
    if (this.props.transition !== "none" && this.props.paneset) {
      this.props.paneset.handleClose(this.id, this.props.onClose);
    } else {
      this.props.onClose();
    }
  };

  getContentClass = () => {
    return classNames(
      css.paneContent,
      { [css.hasPadding]: this.props.padContent },
      { [css.noOverflow]: this.props.noOverflow },
    );
  };

  getRef = () => this.el;

  // we only need a tab-index on the scrollcontainer if there are no other
  // focusable elements within it.
  /**
   * Get the tabIndex value based on the content: -1 when there are focusable
   * elements in the children (preventing the pane itself from receiving focus);
   * 0 otherewise (allowing the pane to receive focus and therefore scroll).
   *
   * This logic is directly copied from MCLRenderer, though the return values
   * here are different.
   *
   * @param {DOM ref} scrollContainer
   * @returns undefined when focusable elements are present in children, '0' otherwise
   */
  getScrollableTabIndex = (scrollContainer) => {
    if (scrollContainer.current) {
      const focusable =
        scrollContainer.current.querySelector(FOCUSABLE_SELECTOR);
      if (focusable) {
        return "-1";
      }
    }
    return "0";
  };

  render() {
    const {
      actionMenu,
      actionMenuAutoFocus, // eslint-disable-line no-unused-vars
      appIcon,
      children,
      centerContent,
      defaultWidth, // eslint-disable-line no-unused-vars
      dismissible,
      firstMenu,
      fluidContentWidth, // eslint-disable-line no-unused-vars
      footer,
      height, // eslint-disable-line no-unused-vars
      lastMenu,
      noOverflow, // eslint-disable-line no-unused-vars
      onClose, // eslint-disable-line no-unused-vars
      padContent, // eslint-disable-line no-unused-vars
      paneset, // eslint-disable-line no-unused-vars
      resizer, // eslint-disable-line no-unused-vars
      onMount, // eslint-disable-line no-unused-vars
      paneSub,
      paneTitle,
      paneTitleRef,
      renderHeader,
      subheader,
      tagName: Element,
      transition, // eslint-disable-line no-unused-vars
      ...rest
    } = this.props;

    return (
      <Element
        className={classNames(css.pane, css.focusIndicator)}
        style={this.state.style}
        ref={this.el}
        {...rest}
      >
        {typeof renderHeader === "function"
          ? renderHeader({
              paneTitle,
              paneTitleRef,
              paneSub,
              appIcon,
              firstMenu,
              lastMenu,
              actionMenu,
              dismissible,
              onClose: this.handleClose,
              id: this.id,
            })
          : null}
        {subheader}
        <div
          className={this.getContentClass()}
          id={`${this.id}-content`}
          key={`${this.id}-content`}
          onFocus={this.setLatestFocused}
          ref={this.contentWrapperEl}
          tabIndex={this.getScrollableTabIndex(this.contentWrapperEl)}
        >
          {centerContent ? (
            <div className={css.container}>{children}</div>
          ) : (
            children
          )}
        </div>
        {footer}
      </Element>
    );
  }
}

Pane.defaultProps = defaultProps;

export default withPaneset(withResize(Pane));
