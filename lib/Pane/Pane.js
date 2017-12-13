import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import css from './Pane.css';
import PaneHeader from '../PaneHeader';
import Paneset from '../Paneset';


const propTypes = {
  defaultWidth: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  transition: PropTypes.string,
  children: PropTypes.node,
  dismissible: PropTypes.oneOfType( // eslint-disable-line
    [
      PropTypes.bool,
      PropTypes.string,
    ],
  ),
  firstMenu: PropTypes.element,
  lastMenu: PropTypes.element,
  paneTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  paneSub: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  fluidContentWidth: PropTypes.bool,
  noOverflow: PropTypes.bool,
  height: PropTypes.string,
  subheader: PropTypes.node,
  padContent: PropTypes.bool, // Removes padding from pane content
};

const contextTypes = {
  paneset: PropTypes.instanceOf(Paneset),
};

const defaultProps = {
  transition: 'none',
  padContent: true,
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
      contentMinWidth: 0,
    };

    this.id = _.uniqueId();
    this.contentMinWidth = 0;
    this.getContentWidth = this.getContentWidth.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.isThisMounted = this.isThisMounted.bind(this);
    this._isMounted = false;
  }

  componentDidMount() {
    let transition;
    if (this.props.transition !== 'none') {
      transition = true;
    }
    const paneObject = { transition, ref: this, id: this.id };
    this.context.paneset.registerPane(paneObject);
    this.animationCallbackID = window.requestAnimationFrame(() => {
      this.setState({ contentMinWidth: this.getContentWidth() });
    });
    this._isMounted = true;
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationCallbackID);
    this._isMounted = false;
    this.context.paneset.removePane();
  }

  isThisMounted() {
    return this._isMounted;
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
      this.context.paneset.handleClose(this.id, this.props.onClose);
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
    const { paneTitle, paneSub, firstMenu, lastMenu, ...rest } = this.props;
    return (
      <div className={css.pane} style={this.state.style} ref={(ref) => { this.el = ref; }}>
        <PaneHeader
          paneTitle={paneTitle}
          paneSub={paneSub}
          firstMenu={firstMenu}
          lastMenu={lastMenu}
          onClose={this.handleClose}
          key={`${this.id}-header`}
          {...rest}
        />
        {this.props.subheader}
        <div key={`${this.id}-content`} className={this.getContentClass()}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Pane.propTypes = propTypes;
Pane.defaultProps = defaultProps;
Pane.contextTypes = contextTypes;

export default Pane;
