import React from 'react';
import PropTypes from 'prop-types';
import { pickBy, uniqueId, cloneDeep, debounce, isEqual } from 'lodash';
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

function getNewPanewidthObject(key, CSSvalue, proportionalChange) {
  const unit = parseCSSUnit(CSSvalue);
  let newWidth = CSSvalue;
  switch (unit) {
    case 'percent':
    case 'vw': break;
    case 'px':
      newWidth = Math.ceil(parseInt(CSSvalue, 10) * proportionalChange);
      newWidth = `${newWidth}px`;
      break;
    case 'em':
      newWidth = Math.ceil(parseInt(CSSvalue, 10) * 14 * proportionalChange);
      newWidth = `${newWidth / 14}em`;
      break;
    case 'rem':
      newWidth = Math.ceil(parseInt(CSSvalue, 10) * 14 * proportionalChange);
      newWidth = `${newWidth / 14}rem`;
      break;
    default: break;
  }
  return {
    id: key,
    defaultWidth: newWidth,
  };
}


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
    // Set fixed width only for panes with the counted value
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
    this.resizeContainer = React.createRef();
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
          getChildInfo: this.getChildInfo,
          isThisMounted: this.isThisMounted,
          isPaneset: true,
          transition: 'none',
          doTransition: false,
          getRef: this.getRef,
          getInstance: this.getInstance,
          handlePaneResize: this.handlePaneResize
        });
      }
    }
    this._isMounted = true;

    this.resizeHandler = window.addEventListener('resize', debounce(this.handleWindowResize, 50));
    this.previousContainerWidth = this.container.current.getBoundingClientRect().width;
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('resize', this.resizeHandler);
    if (this.widthsRAF) {
      cancelAnimationFrame(this.widthsRAF);
      this.widthsRAF = null;
    }

    if (this.resizeNestedTO) {
      clearTimeout(this.resizeNestedTO);
      this.resizeNestedTO = null;
    }

    if (this.transitionCallbackTO) {
      clearTimeout(this.transitionCallbackTO);
      this.transitionCallbackTO = null;
    }

    if (this.interval) {
      clearTimeout(this.interval);
      this.interval = null;
    }

    if (!this.props.isRoot && this.props.paneset) {
      this.props.paneset.removePane();
    }
  }

  resizeToContainer = () => {
    // pick the active layout cache entry - will contain matching id's and number of id's...
    const paneIds = [];
    this.state.panes.forEach((p) => paneIds.push(p.id));
    const matchingCacheIndex = this.state.layoutCache.findIndex((c) => isEqual(Object.keys(c), paneIds));
    if (matchingCacheIndex !== -1) {
      const matchingLCache = this.state.layoutCache[matchingCacheIndex];
      // set array up with defaultWidth and id...pass to calc widths.
      const tempPanesList = [];
      let currentWidth;
      if (!this.props.paneset) {
        currentWidth = this.resizeContainer.current?.getBoundingClientRect().width;
      } else {
        currentWidth = this.container.current?.getBoundingClientRect().width;
      }

      if (currentWidth) {
        const proportionalChange = currentWidth / this.previousContainerWidth;
        for (const p in matchingLCache) {
          if (Object.prototype.hasOwnProperty.call(matchingLCache, p)) {
            const newPO = getNewPanewidthObject(p, matchingLCache[p], proportionalChange);
            tempPanesList.push(newPO);
          }
        }

        // be sure and update the so that we can use this on the next resize...
        this.previousContainerWidth = currentWidth;
        this.setState((curr) => {
          const tempCache = cloneDeep(curr.layoutCache);
          tempCache.splice(matchingCacheIndex, 1);
          return {
            layoutCache: tempCache,
          };
        }, () => {
          // // adjust the layout cache relative to the new client rect size
          // // size panes accordingly.
          const newWidths = this.calcWidths(tempPanesList);
          const changeType = 'windowResize';
          this.updateLayoutCache(newWidths, changeType);
          this.resizePanes(this.state.panes, newWidths);
          this.resizeNestedTO = setTimeout(() => {
            this.state.panes.forEach((p) => {
              if (p.isPaneset) {
                p.getInstance().resizeToContainer();
              }
            });
          });
        });
      }
    }
  }

  handleWindowResize = () => {
    const {
      isRoot,
      paneset
    } = this.props;
    if (isRoot || !paneset) {
      this.resizeToContainer();
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
    panes.forEach((pane) => {
      const styleObject = { flex: `0 0 ${widths[pane.id]}` };
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

  // sometimes the cached sizes might not match up to the actual container due to different sized window.
  // If that's true, scale the cached sizes accordingly.
  resizeCachedSizesToFit = (layoutIndex) => {
    const { layoutCache } = this.state;
    const layoutObject = layoutCache[layoutIndex];

    if (this.resizeContainer.current) {
      // sum the pixels...
      let totalWidth = 0;
      let value;
      for (const p in layoutObject) {
        if (layoutObject[p]) {
          const unit = parseCSSUnit(layoutObject[p]);
          switch (unit) {
            case 'percent':
              return null;
            case 'vw': break;
            case 'px':
              value = Math.ceil(parseInt(layoutObject[p], 10));
              totalWidth += value;
              break;
            default:
              break;
          }
        }
      }

      if (totalWidth > 0) {
        let newCacheObject = {};
        const proportion = totalWidth / this.previousContainerWidth;
        for (const p in layoutObject) {
          if (layoutObject[p]) {
            const newWidth = this.getNewPanewidthObject(p, layoutObject[p], proportion);
            newCacheObject = { ...newCacheObject, ...newWidth };
          }
        }
        return newCacheObject;
      }
    }
    return null;
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
        this.resizePanes(this.state.panes, widths);
      } else if (sizesCached !== -1) {
        widths = this.state.layoutCache[sizesCached];
        const adjustedWidths = this.resizeCachedSizesToFit(sizesCached);
        widths = adjustedWidths || widths;
        this.updateLayoutCache(widths, changeType);
        this.resizePanes(this.state.panes, widths);
      } else {
        widths = this.calcWidths(this.state.panes);
        this.updateLayoutCache(widths, changeType);
        this.resizePanes(this.state.panes, widths);
      }
      // this.resizePanes(this.state.panes, widths);
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
        this.transitionCallbackTO = setTimeout(() => {
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
  getInstance = () => this;

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
    if (this.isThisMounted()) {
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
  }

  // Accepts the positions of handles, the client rect of the container.
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
          resizeContainerRef={this.resizeContainer}
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
