import React from 'react';
import _ from 'lodash';
import css from './Paneset.css';

const propTypes = {
  // applies styling to properly nest the paneset
  nested: React.PropTypes.bool,
  // set if the height of the paneset needs to be controlled.
  static: React.PropTypes.bool,
  // panes and other things that render panes..
  children: React.PropTypes.node,
  // this paneset will not report itself to an ascendent paneset
  isRoot: React.PropTypes.bool,
  // if necessary, Paneset can be assigned a percentage width.
  defaultWidth: React.PropTypes.string,
};

const defaultProps = {
  defaultWidth: 'fill',
}

class Paneset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      paneManager: this,
      panes: [],
      style: {},
    };

    this.container = null;
    this.id = _.uniqueId();
    this.removePane = this.removePane.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.getContainer = this.getContainer.bind(this);
    this.widths = [];
    this.interval = null;
  }

  getContainer(){
    return this.container;
  }

  getChildContext() {
    return { paneset: this.state.paneManager };
  }

  componentDidMount() {
    if(!this.props.isRoot) {
      if (this.context && this.context.paneset) {
        this.context.paneset.registerPane({
          id: this.id,
          ref: this,
          isPaneset: true,
          transition: 'none',
        });
      }
    }
    if(this.props.defaultWidth !== 'fill'){
      this.setState({
        style: {flex: `0 0 ${this.props.defaultWidth}`}
      });
    }
  }

  getClassName() {
    const nested = this.props.nested ? css.nested : '';
    const staticClass = this.props.static === true ? css.static : '';
    const base = css.paneset;
    return `${base} ${nested} ${staticClass}`;
  }

  setStyle(style) {
    this.setState((oldState) => {
      const newState = oldState;
      // clone because you can't mutate style....
      const newStyle = Object.assign({}, newState.style, style);
      newState.style = newStyle;
      return newState;
    });
  }

  resizePanes(panes, widths) {
    requestAnimationFrame(() => {
      panes.forEach((pane, i) => {
        pane.ref.setStyle({ flex: `0 0 ${widths[i]}`, left: '0' });
      }, this);
    });
  }

  removePane(id) {
    const index = this.state.panes.findIndex(p => p.id === id);
    this.setState((oldState) => {
      const newState = oldState;
      if (index !== -1) {
        newState.panes.splice(index, 1);
      }
      const widths = this.calcWidths(newState.panes);
      this.resizePanes(newState.panes, widths);
      return newState;
    });
  }

  // transitions
  // set up initial state for transitions...(register)
  // measurements still in state where new pane isn't there...
  // apply 'in' state for transitions...
  // measurements with added pane
  // Closing...
  // apply 'out' state with callback to remove pane...

  registerPane(paneObject) {
    this.setState((oldState) => {
      const newState = oldState;
      let widths;
      // if the new pane has a transition just set its starting appearance...
      // otherwise resize all the panes...
      if (paneObject.ref.props.transition !== 'none') {
        this.transitionStart(paneObject);
        this.resizePanes(newState.panes, this.widths); // pass cached widths
        newState.panes.push(paneObject);
        this.interval = setTimeout(() => {
          this.transitionEnd();
          this.interval = null;
        }, 5);
      } else {
        newState.panes.push(paneObject);
        widths = this.calcWidths(newState.panes);
        this.resizePanes(newState.panes, widths);
      }
      return newState;
    });
  }

  transitionStart(pane) { // eslint-disable-line class-methods-use-this
    if (pane.ref.props.transition === 'slide') {
      const styleObject = {};
      if (!isNaN(parseInt(pane.ref.props.defaultWidth, 10))) {
        styleObject.flex = `0 0 ${pane.ref.props.defaultWidth}`;
      }
      styleObject.left = '100vh';
      styleObject.transition = 'left .25s ease';
      pane.ref.setStyle(styleObject);
    }
  }

  transitionEnd() {
    const widths = this.calcWidths(this.state.panes);
    this.resizePanes(this.state.panes, widths);
  }

  isRegistered(id) {
    const pane = this.state.panes.filter(p => p.id === id)[0];
    return !!pane;
  }

  handleClose(id, callback) {
    const pane = this.state.panes.filter(p => p.id === id)[0];
    if (pane.ref.props.transition !== 'none') {
      this.transitionStart(pane);
      this.removePane(id);
      this.transitionEnd();
      if (callback) {
        setTimeout(() => {
          callback();
        }, 300);
      }
    } else {
      this.removePane(id);
      if (callback) { callback(); }
    }
  }

  calcWidths(panes) { // find all static widths.
    let staticSpace = 0;
    const dynamics = [];
    const widths = [];

    panes.forEach((pane, i) => {
      if (pane.staticWidth) {
        staticSpace += pane.staticWidth;
      } else {
        const currentPaneWidth = parseInt(pane.ref.props.defaultWidth, 10);
        // if we can't get an int from default width, it's something dynamic like 'fill'
        if (isNaN(currentPaneWidth)) {
          dynamics.push(i);
        } else {
          staticSpace += currentPaneWidth;
          pane.staticWidth = currentPaneWidth; // eslint-disable-line 
        }
      }
    },
    );
    const basePercentage = (100 - staticSpace) / Math.max(dynamics.length, 1);

    panes.forEach((pane, i) => {
      if (dynamics.indexOf(i) !== -1) {
        widths.push(`${basePercentage}%`);
      } else {
        widths.push(panes[i].ref.props.defaultWidth);
      }
    });
    this.widths = widths;
    return widths;
  }

  componentWillUnmount() {
    if(!this.props.isRoot && this.context.paneset) {
      this.context.paneset.removePane(this.id);
    }
  }

  render() {
    return (
      <div className={this.getClassName()} style={this.state.style} ref={(ref) => {this.container = ref;}}>
        {this.props.children}
      </div>
    );
  }
}

const contextTypes = {
  paneset: React.PropTypes.instanceOf(Paneset),
};

Paneset.propTypes = propTypes;
Paneset.defaultProps = defaultProps;
Paneset.contextTypes = contextTypes;
Paneset.childContextTypes = contextTypes;

export default Paneset;
