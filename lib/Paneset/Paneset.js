import React from 'react';
import PropTypes from 'prop-types';
import { pickBy, uniqueId } from 'lodash';
import parseCSSUnit from '../../util/parseCSSUnit';
import css from './Paneset.css';

import { withPaneset, PanesetContext } from './PanesetContext';

const defaultProps = {
  defaultWidth: 'fill',
};

class Paneset extends React.Component {
  static propTypes = {
    // panes and other things that render panes..
    children: PropTypes.node,
    // if necessary, Paneset can be assigned a percentage width.
    defaultWidth: PropTypes.string,
    // id attribute applied to outer <div>.
    id: PropTypes.string,
    // this paneset will not report itself to an ascendent paneset
    isRoot: PropTypes.bool,
    // applies styling to properly nest the paneset
    nested: PropTypes.bool,
    // the parent paneset of the current paneset
    paneset: PropTypes.shape({
      handleClose: PropTypes.func,
      registerPane: PropTypes.func,
      removePane: PropTypes.func,
    }),
    // set if the height of the paneset needs to be controlled.
    static: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    let initStyle = {};
    if (this.props.defaultWidth !== 'fill') {
      initStyle = { flex: `0 0 ${this.props.defaultWidth}` };
    }

    this.state = {
      paneManager: {
        handleClose: this.handleClose,
        registerPane: this.registerPane,
        removePane: this.removePane,
      },
      panes: [],
      style: initStyle,
    };

    this.container = React.createRef();
    this.id = uniqueId();
    this.widths = [];
    this.interval = null;
    this._isMounted = false;
  }

  componentDidMount() {
    if (!this.props.isRoot) {
      if (this.props.paneset) { // register with parent paneset if it exists
        this.props.paneset.registerPane({
          id: this.id,
          setStyle: this.setStyle,
          isMounted: this.isThisMounted,
          isPaneset: true,
          transition: 'none',
          doTransition: false,
        });
      }
    }
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (!this.props.isRoot && this.props.paneset) {
      this.props.paneset.removePane();
    }
  }

  isThisMounted = () => this._isMounted;

  getContainer = () => this.container.current;

  getClassName = () => {
    const nested = this.props.nested ? css.nested : '';
    const staticClass = this.props.static === true ? css.static : '';
    const base = css.paneset;
    return `${base} ${nested} ${staticClass}`;
  }

  setStyle = (style) => {
    if (this.isThisMounted()) {
      this.setState((oldState) => {
        const newState = oldState;
        // clone because you can't mutate style....
        const newStyle = Object.assign({}, newState.style, style);
        newState.style = newStyle;
        return newState;
      });
    }
  }

  resizePanes = (panes, widths) => {
    panes.forEach((pane, i) => {
      pane.setStyle({ flex: `0 0 ${widths[i]}`, left: '0' });
    });
  }

  removePane = () => {
    this.setState((oldState) => {
      // accounts for odd situations where multiple Panes are dismissed/dismounted at once...
      // simply filters out any that have dismounted.
      const newPanes = oldState.panes.filter(p => p.isThisMounted());
      const newState = Object.assign({}, oldState);
      newState.panes = newPanes;
      return newState;
    }, this.calcWidthsAndResize);
  }

  // transitions
  // set up initial state for transitions...(register)
  // measurements still in state where new pane isn't there...
  // apply 'in' state for transitions...
  // measurements with added pane
  // Closing...
  // apply 'out' state with callback to remove pane...

  registerPane = (paneObject) => {
    this.setState((oldState) => {
      const newState = Object.assign({}, oldState);
      // if the new pane has a transition just set its starting appearance...
      // otherwise resize all the panes...
      if (paneObject.transition !== 'none') {
        this.transitionStart(paneObject);
        this.resizePanes(newState.panes, this.widths); // pass cached widths
        newState.panes.push(paneObject);
        this.interval = setTimeout(() => {
          this.transitionEnd();
          this.interval = null;
        }, 5);
      } else {
        newState.panes.push(paneObject);
      }
      return newState;
    }, this.calcWidthsAndResize);
  }

  calcWidthsAndResize = () => {
    requestAnimationFrame(() => {
      const widths = this.calcWidths(this.state.panes);
      this.resizePanes(this.state.panes, widths);
    });
  }

  transitionStart = (pane) => {
    if (pane.transition === 'slide') {
      const styleObject = {};
      if (!Number.isNaN(parseInt(pane.defaultWidth, 10))) {
        styleObject.flex = `0 0 ${pane.defaultWidth}`;
      }
      styleObject.left = '100vh';
      styleObject.transition = 'left .25s ease';
      pane.setStyle(styleObject);
    }
  }

  transitionEnd = () => {
    const widths = this.calcWidths(this.state.panes);
    this.resizePanes(this.state.panes, widths);
  }

  isRegistered = (id) => {
    const pane = this.state.panes.filter(p => p.id === id)[0];
    return !!pane;
  }

  handleClose = (id, callback) => {
    const pane = this.state.panes.filter(p => p.id === id)[0];
    if (pane.transition !== 'none') {
      this.transitionStart(pane);
      this.removePane();
      this.transitionEnd();
      if (callback) {
        setTimeout(() => {
          callback();
        }, 300);
      }
    } else {
      this.removePane();
      if (callback) { callback(); }
    }
  }

  calcWidths = (panes) => { // find all static widths.
    let staticSpace = 0;
    const dynamics = [];
    const widths = [];
    const container = this.getContainer();

    if (!container) {
      this.widths = widths;

      return widths;
    }

    const containerWidth = container.offsetWidth;

    panes.forEach((pane, i) => {
      if (pane.staticWidth) {
        staticSpace += pane.staticWidth;
      } else {
        const currentPaneWidth = parseInt(pane.defaultWidth, 10);
        // if we can't get an int from default width, it's something dynamic like 'fill'
        if (Number.isNaN(currentPaneWidth)) {
          dynamics.push(i);
        } else {
          // parse unit
          const unit = parseCSSUnit(pane.defaultWidth);
          // convert to pixels
          let parsedWidth;
          switch (unit) {
            case 'percent':
            case 'vw':
              parsedWidth = currentPaneWidth * 0.01 * containerWidth;
              break;
            case 'px':
              parsedWidth = currentPaneWidth;
              break;
            case 'em':
            case 'rem':
              // system rem of 14
              parsedWidth = currentPaneWidth * 14;
              break;
            default:
              parsedWidth = currentPaneWidth;
          }
          staticSpace += parsedWidth;
          pane.staticWidth = parsedWidth;
        }
      }
    });
    const staticPercent = ((containerWidth - staticSpace) / containerWidth) * 100;
    const basePercentage = staticPercent / Math.max(dynamics.length, 1);

    panes.forEach((pane, i) => {
      if (dynamics.indexOf(i) !== -1) {
        widths.push(`${basePercentage}%`);
      } else {
        widths.push(panes[i].defaultWidth);
      }
    });
    this.widths = widths;
    return widths;
  }

  render() {
    const {
      id,
      children,
    } = this.props;

    // pull any data-test-* props into a spreadable object
    const dataProps = pickBy(this.props, (val, key) => /^data-test/.test(key));

    return (
      <PanesetContext.Provider value={this.state.paneManager}>
        <div className={this.getClassName()} id={id} style={this.state.style} ref={this.container} {...dataProps}>
          {children}
        </div>
      </PanesetContext.Provider>
    );
  }
}

Paneset.defaultProps = defaultProps;

export default withPaneset(Paneset);
