import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import css from './Pane.css';
import PaneHeader from '../PaneHeader';
import { withPaneset } from '../Paneset/PanesetContext';
import { withResize } from '../Paneset/ResizeContext';

const propTypes = {
  actionMenu: PropTypes.func,
  actionMenuAutoFocus: PropTypes.bool,
  appIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.element]),
  centerContent: PropTypes.bool,
  children: PropTypes.node,
  defaultWidth: PropTypes.string.isRequired,
  dismissible: PropTypes.oneOfType(
    [
      PropTypes.bool,
      PropTypes.string,
    ],
  ),
  firstMenu: PropTypes.element,
  fluidContentWidth: PropTypes.bool,
  footer: PropTypes.element,
  height: PropTypes.string,
  id: PropTypes.string,
  lastMenu: PropTypes.element,
  noOverflow: PropTypes.bool,
  onClose: PropTypes.func,
  onMount: PropTypes.func,
  padContent: PropTypes.bool, // Removes padding from pane content
  paneset: PropTypes.shape({
    handleClose: PropTypes.func,
    registerPane: PropTypes.func,
    removePane: PropTypes.func,
  }),
  paneSub: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  paneTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  paneTitleRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderHeader: PropTypes.func,
  resizer: PropTypes.shape({
    registerHandle: PropTypes.func,
    removeHandle: PropTypes.func,
    updateHandle: PropTypes.func,
  }),
  subheader: PropTypes.node,
  tagName: PropTypes.string,
  transition: PropTypes.string
};

const defaultProps = {
  centerContent: false,
  padContent: true,
  tagName: 'section',
  transition: 'none',
  renderHeader: (props) => <PaneHeader {...props} />
};

class Pane extends React.Component {
  constructor(props) {
    super(props);

    let initStyle = {};
    if (this.props.defaultWidth !== 'fill') {
      initStyle = Object.assign(initStyle, { flex: `0 0 ${this.props.defaultWidth}` });
    }
    if (this.props.height) {
      initStyle = Object.assign(initStyle, { height: `${this.props.height}` });
    }
    this.state = {
      style: initStyle,
      contentMinWidth: 0, // eslint-disable-line react/no-unused-state
    };

    this.id = props.id || uniqueId();
    this.resizeId = uniqueId('resize');
    this.contentMinWidth = 0;
    this._isMounted = false;
    this._lastFocusedChild = null;
    this.el = React.createRef();

    /**
     * App Icon warning
     * (will be removed later)
     */
    const { appIcon } = this.props;
    if (typeof appIcon === 'object' && typeof appIcon.app === 'string') {
      console.warn(`
        [DEPRECATION] Pass an <AppIcon> (from stripes-core)
        to the appIcon-prop on <Pane> instead of an object.
      `);
    }
  }

  componentDidMount() {
    const { transition, defaultWidth, paneset, resizer, paneTitleRef, onMount } = this.props;
    const paneObject = {
      transition,
      setStyle: this.setStyle,
      isThisMounted: this.isThisMounted,
      defaultWidth,
      id: this.id,
      getRef: this.getRef,
    };
    if (paneset) {
      paneset.registerPane(paneObject);
    }
    if (resizer) {
      resizer.registerHandle({
        id: this.resizeId,
        elementId: this.id,
        getRef: this.getRef
      });
    }
    this.animationCallbackID = window.requestAnimationFrame(() => {
      this.setState({ contentMinWidth: this.getContentWidth() }); // eslint-disable-line react/no-unused-state
    });
    this._isMounted = true;

    if (onMount) {
      onMount({
        paneRef: this.el,
        paneTitleRef
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
  }

  getLatestFocused = () => this._lastFocusedChild;

  setStyle = (style) => {
    if (this._isMounted) {
      this.setState((oldState) => {
        const nextState = Object.assign({}, oldState);
        // clone because you can't mutate style....
        const newStyle = Object.assign({}, nextState.style, style);
        nextState.style = newStyle;
        return nextState;
      },
      () => this.props.resizer.updateHandle(this.id));
    }
  }

  getContentWidth = () => {
    if (!this.props.fluidContentWidth) {
      if (this.props.defaultWidth === 'fill') {
        return '960px';
      }
      const widthNum = parseInt(this.props.defaultWidth, 10);
      const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const widthCalc = ((widthNum / 100) * w) - 175;
      return `${widthCalc}px`;
    }
    return 'none'; // content should have no minWidth.
  }

  handleClose = () => {
    if (this.props.transition !== 'none' && this.props.paneset) {
      this.props.paneset.handleClose(this.id, this.props.onClose);
    } else {
      this.props.onClose();
    }
  }

  getContentClass = () => {
    return classNames(
      css.paneContent,
      { [css.hasPadding]: this.props.padContent },
      { [css.noOverflow]: this.props.noOverflow },
    );
  }

  getRef = () => this.el;

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
        {typeof renderHeader === 'function' ? renderHeader({
          paneTitle,
          paneTitleRef,
          paneSub,
          appIcon,
          firstMenu,
          lastMenu,
          actionMenu,
          dismissible,
          onClose: this.handleClose,
          id: this.id
        }) : null}
        {subheader}
        <div
          key={`${this.id}-content`}
          id={`${this.id}-content`}
          tabIndex="-1"
          className={this.getContentClass()}
          onFocus={this.setLatestFocused}
        >
          {centerContent ? <div className={css.container}>{children}</div> : children }
        </div>
        {footer}
      </Element>
    );
  }
}

Pane.propTypes = propTypes;
Pane.defaultProps = defaultProps;

export default withPaneset(withResize(Pane));
