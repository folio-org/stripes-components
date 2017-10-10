import React from 'react';
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
  fluidContentWidth: PropTypes.bool,
  noOverflow: PropTypes.bool,
  contentPadding: PropTypes.number,
  height: PropTypes.string,
};

const contextTypes = {
  paneset: PropTypes.instanceOf(Paneset),
};

const defaultProps = {
  transition: 'none',
  contentPadding: 16,
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
    this.getContentStyle = this.getContentStyle.bind(this);
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
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationCallbackID);
    this.context.paneset.removePane(this.id);
  }

  setStyle(style) {
    this.setState((oldState) => {
      const nextState = oldState;
      // clone because you can't mutate style....
      const newStyle = Object.assign({}, nextState.style, style);
      nextState.style = newStyle;
      return nextState;
    });
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

  getContentStyle() {
    return { 
      width: '100%', 
      height: '100%', 
      overflow: this.props.noOverflow ? 'none' : 'auto', 
      padding: `${this.props.contentPadding}px`, 
    }
  }

  render() {
    const { paneTitle, firstMenu, lastMenu, ...rest } = this.props;
    return (
      <div className={css.pane} style={this.state.style} ref={(ref) => { this.el = ref; }}>
        <PaneHeader
          paneTitle={paneTitle}
          firstMenu={firstMenu}
          lastMenu={lastMenu}
          onClose={this.handleClose}
          key={`${this.id}-header`}
          {...rest}
        />
        <div key={`${this.id}-content`} style={this.getContentStyle()}>
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
