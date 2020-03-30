import React from 'react';
import PropTypes from 'prop-types';
import { pickBy, uniqueId, cloneDeep, isEqual } from 'lodash';
import parseCSSUnit from '../../util/parseCSSUnit';
import css from './Paneset.css';
import PaneResizeContainer from './PaneResizeContainer';

import { withPaneset, PanesetContext } from './PanesetContext';

function swap(first, second, array) {
  const temp = array[first];
  array[first] = array[second];
  array[second] = temp;
}

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
        getContainer: this.getContainer,
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
          isThisMounted: this.isThisMounted,
          isPaneset: true,
          transition: 'none',
          doTransition: false,
          getRef: this.getRef,
          handlePaneResize: this.handlePaneResize
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
      const styleObject = { flex: `0 0 ${widths[i]}` };
      if (!pane.transitioning) {
        styleObject.left = '0px';
      }
      pane.setStyle(styleObject);
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
          this.transitionEnd(paneObject);
          this.interval = null;
        });
      } else {
        newState.panes.push(paneObject);
      }
      return newState;
    }, () => {
      this.calcWidthsAndResize();
    });
  }

  calcWidthsAndResize = () => {
    requestAnimationFrame(() => {
      const widths = this.calcWidths(this.state.panes);
      this.resizePanes(this.state.panes, widths);
      if (this.state.panes.length > 1 && !this.state.panes.some(p => p.transitioning)) {
        this.sortPanesByClientRect();
      }
    });
  }

  transitionStart = (pane) => {
    if (pane.transition === 'slide') {
      const styleObject = {};
      if (!Number.isNaN(parseInt(pane.defaultWidth, 10))) {
        styleObject.flex = `0 0 ${pane.defaultWidth}`;
      }
      styleObject.left = '100vw';
      styleObject.transition = 'left .25s ease';
      pane.transitioning = true;
      pane.setStyle(styleObject);
    }
  }

  transitionEnd = (pane) => {
    pane.transitioning = false;
    this.calcWidthsAndResize();
  }

  sortPanesByClientRect = () => {
    const { panes } = this.state;
    const temp = cloneDeep(panes);
    temp.forEach((p, i) => {
      const current = p.getRef()?.current;
      const next = temp[i + 1]?.getRef().current;
      if (current && next) {
        if (current.getBoundingClientRect().left > next.getBoundingClientRect().left) {
          swap(i, i + 1, temp);
        }
      }
    });
    if (!isEqual(temp, this.state.panes)) {
      this.setState({
        panes: temp
      });
    }
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
      this.transitionEnd(pane);
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

  getRef = () => this.container;

  handlePaneResize = ({ positions, containerRect, ...rest }) => {
    const { panes } = this.state;
    const newWidths = [];
    const otherWidths = [];
    // console.log(positions);

    positions.forEach((pos, i) => {
      const nextPos = positions[i + 1];
      const widthB = nextPos ? nextPos.x : containerRect.width;
      if (panes.findIndex(p => p.id === pos.elementId) !== -1) {
        newWidths.push(`${widthB - pos.x}px`);
      } else {
        // we just put numbers in other widths... these get added later.
        otherWidths.push(widthB - pos.x);
      }
    });

    // sum the other widths as a paneset width...
    const paneSetWidth = otherWidths.reduce((sum, w) => sum + w, 0);

    // console.log(`newWidths: ${newWidths}`);
    // console.log(`otherWidths: ${otherWidths}`);
    // call resize panes...
    this.resizePanes(panes, [...newWidths, `${paneSetWidth}px`]);
    // pass widths down if any or leftover...
    if (otherWidths.length > 1) {
      const panesetIndex = panes.findIndex(p => p.isPaneset);
      if (panesetIndex !== -1) {
        panes[panesetIndex].handlePaneResize({ positions, containerRect, ...rest });
      }
    }
  }

  render() {
    const {
      id,
      children,
      paneset,
      isRoot
    } = this.props;

    // pull any data-test-* props into a spreadable object
    const dataProps = pickBy(this.props, (val, key) => /^data-test/.test(key));

    return (
      <PanesetContext.Provider value={this.state.paneManager}>
        <PaneResizeContainer isRoot={isRoot || !paneset} onElementResize={this.handlePaneResize}>
          <div className={this.getClassName()} id={id} style={this.state.style} ref={this.container} {...dataProps}>
            {children}
          </div>
        </PaneResizeContainer>
      </PanesetContext.Provider>
    );
  }
}

Paneset.defaultProps = defaultProps;

export default withPaneset(Paneset);
