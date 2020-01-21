import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import css from './Pane.css';
import PaneHeader from '../PaneHeader';
import { withPaneset } from '../Paneset/PanesetContext';

const propTypes = {
  actionMenu: PropTypes.func,
  actionMenuAutoFocus: PropTypes.bool,
  appIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.element]),
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
  subheader: PropTypes.node,
  tagName: PropTypes.string,
  transition: PropTypes.string,
};

const defaultProps = {
  padContent: true,
  tagName: 'section',
  transition: 'none',
  renderHeader: renderProps => (
    <PaneHeader {...renderProps} />
  )
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
    this.contentMinWidth = 0;
    this.getContentWidth = this.getContentWidth.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.isThisMounted = this.isThisMounted.bind(this);
    this._isMounted = false;
    this.setLatestFocused = this.setLatestFocused.bind(this);
    this.getLatestFocused = this.getLatestFocused.bind(this);
    this._lastFocusedChild = null;

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
    let transition;
    if (this.props.transition !== 'none') {
      transition = true;
    }
    const paneObject = { transition, ref: this, id: this.id };
    this.props.paneset.registerPane(paneObject);
    this.animationCallbackID = window.requestAnimationFrame(() => {
      this.setState({ contentMinWidth: this.getContentWidth() }); // eslint-disable-line react/no-unused-state
    });
    this._isMounted = true;
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationCallbackID);
    this._isMounted = false;
    this.props.paneset.removePane();
  }

  isThisMounted() {
    return this._isMounted;
  }

  setLatestFocused(e) {
    this._lastFocusedChild = e.target;
  }

  getLatestFocused() {
    return this._lastFocusedChild;
  }

  setStyle(style) {
    if (this._isMounted) {
      this.setState((oldState) => {
        const nextState = Object.assign({}, oldState);
        // clone because you can't mutate style....
        const newStyle = Object.assign({}, nextState.style, style);
        nextState.style = newStyle;
        return nextState;
      });
    }
  }

  getContentWidth() {
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

  handleClose() {
    if (this.props.transition !== 'none') {
      this.props.paneset.handleClose(this.id, this.props.onClose);
    } else {
      this.props.onClose();
    }
  }

  getContentClass() {
    return classNames(
      css.paneContent,
      { [css.hasPadding]: this.props.padContent },
      { [css.noOverflow]: this.props.noOverflow },
    );
  }

  render() {
    const {
      actionMenu,
      actionMenuAutoFocus, // eslint-disable-line no-unused-vars
      appIcon,
      children,
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
        className={css.pane}
        style={this.state.style}
        ref={(ref) => { this.el = ref; }}
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
        <div key={`${this.id}-content`} className={this.getContentClass()} onFocus={this.setLatestFocused}>
          {children}
        </div>
        {footer}
      </Element>
    );
  }
}

Pane.propTypes = propTypes;
Pane.defaultProps = defaultProps;

export default withPaneset(Pane);
