import React from 'react';
import PropTypes from 'prop-types';
import { pickBy, uniqueId, cloneDeep } from 'lodash';
import parseCSSUnit from '../../util/parseCSSUnit';
import insertByClientRect from './insertByClientRect';
import css from './Paneset.css';
import PaneResizeContainer from './PaneResizeContainer';

import { withPaneset, PanesetContext } from './PanesetContext';

const defaultProps = {
  defaultWidth: 'fill',
  onLayout: () => null,
  initialLayouts: [],
};

class Paneset extends React.Component {
  static propTypes = {
    // panes and other things that render panes..
    children: PropTypes.node,
    // if necessary, Paneset can be assigned a percentage width.
    defaultWidth: PropTypes.string,
    // id attribute applied to outer <div>.
    id: PropTypes.string,
    // used to initialize Layout Cache of paneset widths
    initialLayouts: PropTypes.arrayOf(PropTypes.object),
    // this paneset will not report itself to an ascendent paneset
    isRoot: PropTypes.bool,
    // applies styling to properly nest the paneset
    nested: PropTypes.bool,
    // callback for overriding layout from the application level
    onLayout: PropTypes.func,
    // callback when panes are resized by the user.
    onResize: PropTypes.func,
    // the parent paneset of the current paneset
    paneset: PropTypes.shape({
      getTopmostContainer: PropTypes.func,
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
        getTopmostContainer: this.getTopmostContainer,
      },
      panes: [],
      layoutCache: props.initialLayouts,
      style: initStyle,
      changeType: 'init',
    };

    this.container = React.createRef();
    this.id = props.id || uniqueId('paneset-');
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

    if (this.widthsRAF) {
      cancelAnimationFrame(this.widthsRAF);
      this.widthsRAF = null;
    }

    if (!this.props.isRoot && this.props.paneset) {
      this.props.paneset.removePane();
    }
  }

  isThisMounted = () => this._isMounted;

  getContainer = () => this.container.current;

  getTopmostContainer = () => {
    const { paneset, isRoot } = this.props;
    if (!isRoot && paneset) {
      return paneset.getTopmostContainer();
    }
    return this.getContainer();
  }

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
        newState.changeType = 'paneset-resized';
        return newState;
      });
    }
  }

  resizePanes = (panes, widths) => {
    panes.forEach((pane, i) => {
      const isNotLastPane = (i < panes.length - 1);
      const styleObject = { flex: isNotLastPane && `0 0 ${widths[pane.id]}` };
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
      newState.changeType = 'removed';
      return newState;
    }, this.calcWidthsAndResize('removed'));
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
      let newState = Object.assign({}, oldState);
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
        // insert sorted by left coordinate of clientrect...
        const newPanes = insertByClientRect(newState.panes, paneObject);
        newState = Object.assign(newState, { panes: newPanes, changeType: 'added' });
        // newState = this.insertPaneObject(newState, paneObject);
      }
      return newState;
    }, () => {
      this.calcWidthsAndResize();
    });
  }

  calcWidthsAndResize = (changeType) => {
    this.widthsRAF = requestAnimationFrame(() => {
      let widths;
      const nextLayout = {};
      this.state.panes.forEach(p => { nextLayout[p.id] = 0; });
      const sizesCached = this.hasCachedLayout(nextLayout);
      const toApply = this.props.onLayout({
        changeType,
        nextLayout,
        layoutCached: (sizesCached === -1),
        layoutCache: this.state.layoutCache,
        widths: sizesCached !== -1 ? null : this.state.layoutCache[sizesCached],
      });

      if (toApply && sizesCached === -1) {
        widths = toApply;
        this.updateLayoutCache(widths, changeType);
      } else if (sizesCached !== -1) {
        widths = this.state.layoutCache[sizesCached];
      } else {
        widths = this.calcWidths(this.state.panes);
        this.updateLayoutCache(widths, changeType);
      }
      this.resizePanes(this.state.panes, widths);
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
    const widths = {};
    const container = this.getContainer();

    if (!container) {
      this.widths = widths;

      return widths;
    }

    const containerWidth = container.offsetWidth;

    panes.forEach((pane) => {
      if (pane.staticWidth) {
        staticSpace += pane.staticWidth;
      } else {
        const currentPaneWidth = parseInt(pane.defaultWidth, 10);
        // if we can't get an int from default width, it's something dynamic like 'fill'
        if (Number.isNaN(currentPaneWidth)) {
          dynamics.push(pane.id);
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
    const basePercentage = staticPercent / Math.max(Object.keys(dynamics).length, 1);

    panes.forEach((pane, i) => {
      if (dynamics.indexOf(pane.id) !== -1) {
        widths[pane.id] = `${basePercentage}%`;
      } else {
        widths[pane.id] = panes[i].defaultWidth;
      }
    });
    this.widths = widths;
    return widths;
  }

  getRef = () => this.container;

  hasCachedLayout = (candidate) => {
    const layoutIndex = this.state.layoutCache.findIndex((cache) => {
      const cacheKeys = Object.keys(cache);
      const candidateKeys = Object.keys(candidate);
      if (cacheKeys.length === candidateKeys.length) {
        return cacheKeys.every(ck => candidateKeys.indexOf(ck) !== -1);
      }
      return false;
    });
    return layoutIndex;
  };

  updateLayoutCache = (layoutMap) => {
    this.setState(({ layoutCache }) => {
      // find duplicates with like lengths, id's...
      const layoutIndex = this.hasCachedLayout(layoutMap);
      if (layoutIndex !== -1) {
        const tempCache = cloneDeep(layoutCache);
        tempCache[layoutIndex] = layoutMap;
        return {
          layoutCache: tempCache
        };
      }
      return { layoutCache: [...layoutCache, layoutMap], changeType: 'resize' };
    }, () => {
      if (this.props.onResize) {
        this.props.onResize({
          currentLayout: layoutMap,
          layoutCache: this.state.layoutCache
        });
      }
    });
  }

  handlePaneResize = ({ positions, containerRect, ...rest }) => {
    const { panes } = this.state;
    const newWidths = {};
    const otherWidths = [];

    positions.forEach((pos, i) => {
      const nextPos = positions[i + 1];
      const positionBounds = nextPos ? nextPos.x : containerRect.width;
      if (panes.findIndex(p => p.id === pos.elementId) !== -1) {
        const newWidth = `${positionBounds - pos.x}px`;
        newWidths[pos.elementId] = newWidth;
      } else {
        // other widths remain as numbers for future math (no css unit yet)
        otherWidths.push(positionBounds - pos.x);
      }
    });

    // resize panes...
    const panesetIndex = panes.findIndex(p => p.isPaneset);
    if (panesetIndex !== -1) {
      // sum the other widths as a paneset width...
      const paneSetWidth = otherWidths.reduce((sum, w) => sum + w, 0);
      const panesetId = panes[panesetIndex].id;
      newWidths[panesetId] = paneSetWidth;
      panes[panesetIndex].handlePaneResize({ positions, containerRect, ...rest });
    }

    this.resizePanes(panes, newWidths);
    this.updateLayoutCache(newWidths, 'resize');
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
        <PaneResizeContainer
          isRoot={isRoot || !paneset}
          parentElement={this.container?.current}
          onElementResize={this.handlePaneResize}
        >
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
