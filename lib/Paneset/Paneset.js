import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pickBy, uniqueId, cloneDeep, debounce } from 'lodash';
import parseCSSUnit from '../util/parseCSSUnit';
import insertByClientRect from './insertByClientRect';
import css from './Paneset.css';
import PaneResizeContainer from './PaneResizeContainer';

import { withPaneset, PanesetContext } from './PanesetContext';

/* Panes
*  Panesets hold pass an API down to panes via React context that registers
*  the pane and allows Paneset to track the widths of each mounted pane
*  so that they may be appropriately resized. increasing the size of one makes another shrink.
*  Panesets also handle shrinking or growing the panes as the window is resized.
*/

/* Dataflow
*  Pane-resizing:
*  handlePaneResize() -> resizePanes(), updateLayoutCache()
*  Window resizing:
*  resizeToContainer() -> updateLayoutCache(), resizePanes()
*  Adding a pane:
*  registerPane() ->
      insertByClientRect(), calcWidthsAndResize() -> resizeCachedSizeToFit(), resizePanes(), updateLayoutCache()
*/

/* Data shapes:
*
*  widths - (used by calcWidths()) are in the shape of { id: <string>, defaultWidth: <string> }
*
*  layoutCache -  (held by state) is an array of objects where keys are id's and values are CSS-string
*    values (eg '327px', '24%') in the shape of { <paneid string>: <width string> }
*    layoutCache items represent different combinations of panes (1, 2, 3, n ) panes and
*    dictate the widths to be used when that particular set of panes mounts.
*    LayoutCache is held by the paneset's state to be used and re-applied when particular set of
*    panes is re-mounted. In the persisted paneset smart-component, this
*    cache is saved to localStorage and brought back into the component via props (so it survives switching apps)
*
*  pane array - the panes (on mount) register a collection of data and functions to state for easy access within
*    this component
*    including their defaultWidth prop, a function to get their outer element, and their setStyle method.
*/

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
      newWidth = parseFloat(CSSvalue, 10) * proportionalChange;
      newWidth = `${newWidth}%`;
      break;
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

function isUnitPixelBased(cssString) {
  const pixelValues = ['px', 'em', 'rem'];
  return pixelValues.some(pv => cssString.includes(pv));
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
      // layoutCache must not be null, but initialLayouts may come in that way,
      // e.g. if the calling component looks for a cached value but doesn't
      // find one then initialLayouts will be present but null.
      layoutCache: props.initialLayouts ?? [],
      style: initStyle,
      changeType: 'init', // eslint-disable-line react/no-unused-state
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
          handlePaneResize: this.handlePaneResize,
          getChildPanesTotalWidth: this.getChildPanesTotalWidth
        });
      }
    }
    this._isMounted = true;

    this.resizeHandler = window.addEventListener('resize', debounce(this.handleWindowResize, 50));
    this.previousContainerWidth = this.container.current?.getBoundingClientRect().width;
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
      this.props.paneset.removePane(false);
    }
  }

  // resizeToContainer - called when the window is resized.
  // Resizes panes to fit the window width *or the width of the containing paneset(if nested.)
  // compares the current window / container width to the total width of the
  // pane elements and resizes them via a multiplier.
  // if the window is resized to twice as large, panes are resized to twice the pixel size.

  resizeToContainer = () => {
    // no sense doing all this math if the component has already unmounted
    if (!this._isMounted) {
      return;
    }

    // pick the active layout cache entry - will contain matching id's and number of id's...
    const paneIds = [];
    this.state.panes.forEach((p) => paneIds.push(p.id));

    let currentWidth;
    if (!this.props.paneset) {
      currentWidth = window.innerWidth;
    } else {
      currentWidth = this.container.current?.getBoundingClientRect().width;
    }

    let totalWidth = 0;

    // check for cached layout covers instances where the keys of the object may not be in the same order as
    // the "paneId" array.
    const matchingCacheIndex = this.state.layoutCache?.findIndex((c) => {
      const cacheIds = Object.keys(c);
      if (cacheIds.length !== paneIds.length) return false;
      return cacheIds.every((id) => paneIds.includes(id));
    }) ?? -1;
    if (matchingCacheIndex !== -1) {
      const matchingLCache = this.state.layoutCache[matchingCacheIndex];
      // set array up with defaultWidth and id...pass to calc widths.
      const tempPanesList = [];

      if (currentWidth) {
        // get an actual width of the paneset...
        totalWidth = this.getChildPanesTotalWidth();

        // if the totalWidth is 0, panes haven't been sized yet, so go ahead and calcWidths/resize...
        if (totalWidth === 0) {
          const widths = this.calcWidths(this.state.panes);
          this.resizePanes(this.state.panes, widths);
          return;
        }

        // check actual width against width of containing element... this prevents continued proportional resizes.
        if (Math.floor(totalWidth) !== currentWidth) {
          const proportionalChange = currentWidth / totalWidth;
          for (const p in matchingLCache) {
            if (Object.prototype.hasOwnProperty.call(matchingLCache, p)) {
              const newPO = getNewPanewidthObject(p, matchingLCache[p], proportionalChange);
              tempPanesList.push(newPO);
            }
          }

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

            // be sure and update the so that we can use this on the next resize...
            this.previousContainerWidth = currentWidth;

            const changeType = 'windowResize';
            this.updateLayoutCache(newWidths, changeType);
            this.resizePanes(this.state.panes, newWidths);
            this.resizeNestedTO = setTimeout(this.resizeNestedPanesets);
          });
        } else {
          // even if the width of the outside containers fills the window (currentWidth === totalWidth) the panes within
          // nested panesets may need resizing...
          this.setState({ changeType: 'windowResizeNestedPanesetPanes' }, // eslint-disable-line react/no-unused-state
            () => {
              this.resizeNestedTO = setTimeout(this.resizeNestedPanesets);
            });
        }
      }
    } else {
      const tempCache = {};
      const tempPanesList = [];

      totalWidth = this.getChildPanesTotalWidth();

      // if panes don't fill the container, resize them as well as nested panesets.
      if (Math.floor(totalWidth) !== currentWidth) {
        const proportionalChange = currentWidth / totalWidth;
        for (const p in tempCache) {
          if (Object.prototype.hasOwnProperty.call(tempCache, p)) {
            const newPO = getNewPanewidthObject(p, tempCache[p], proportionalChange);
            tempPanesList.push(newPO);
          }
        }
        const newWidths = this.calcWidths(tempPanesList);
        this.setState({ changeType: 'windowResizeUncached' }, // eslint-disable-line react/no-unused-state
          () => {
            this.resizePanes(this.state.panes, newWidths);
            this.resizeNestedTO = setTimeout(this.resizeNestedPanesets);
          });
      } else {
        // even if the width of the outside containers fills the window (currentWidth === totalWidth) the panes within
        // nested panesets may need resizing...
        this.setState({ changeType: 'windowResizeNestedUncached' }, // eslint-disable-line react/no-unused-state
          () => {
            this.resizeNestedTO = setTimeout(this.resizeNestedPanesets);
          });
      }
    }
  }

  resizeNestedPanesets = () => {
    if (this._isMounted) {
      this.state.panes.forEach((p) => {
        if (p.isPaneset) {
          p.getInstance().resizeToContainer();
        }
      });
    }
    this.resizeNestedTO = null;
  }

  // return total width of child panes of this and any nested panesets.
  getChildPanesTotalWidth = (panesList = this.state.panes) => {
    let totalWidth = 0;
    panesList.forEach((p) => {
      if (p.isPaneset) {
        totalWidth += p.getChildPanesTotalWidth();
      } else {
        const elem = p.getRef();
        if (elem.current) {
          totalWidth += elem.current.getBoundingClientRect().width;
        }
      }
    });
    return totalWidth;
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
    const { nested, static: propsStatic } = this.props;
    return classNames([
      { [css.nested]: nested },
      { [css.static]: propsStatic },
      css.paneset
    ]);
  }

  setStyle = () => {
    if (this.isThisMounted()) {
      const {
        paneset,
        isRoot
      } = this.props;

      // for nested, non-root panesets, we resize their element to the edge of the screen.
      // this resolves a cropping behavior (impetus for STCOM-953) and allows
      // paneset to accurately resize its children (overflow: hidden)
      if (paneset && !isRoot) {
        const containerBounds = this.container.current?.getBoundingClientRect();
        if (containerBounds.right < window.offsetWidth) {
          this.setState((curState) => {
            const {
              left, right
            } = containerBounds;
            const newStyle = { flex: `0 0 ${right - left}px` };
            return {
              changeType: 'nested-resize-end',
              style: { ...curState.style, ...newStyle }
            };
          });
        }
      }
    }
  }

  resizePanes = (panes, widths) => {
    if (widths !== null) {
      panes.forEach((pane) => {
        const styleObject = { flex: `0 0 ${widths[pane.id]}` };
        if (!pane.transitioning) {
          styleObject.left = '0px';
        }
        pane.setStyle(styleObject);
      });
    }
  }

  removePane = (shouldResize = true) => {
    this.setState((oldState) => {
      // accounts for odd situations where multiple Panes are dismissed/dismounted at once...
      // simply filters out any that have dismounted.
      const newPanes = oldState.panes.filter(p => p.isThisMounted());
      const newState = Object.assign({}, oldState);
      newState.panes = newPanes;
      newState.changeType = 'removed';
      return newState;
    }, () => {
      if (shouldResize) this.calcWidthsAndResize('removed');
    });
  }

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
      this.calcWidthsAndResize('added');
    });
  }

  // sometimes the cached sizes might not match up to the actual container
  // due the window being a different size when the cache was created.
  // If that's true, scale the cached sizes accordingly.
  resizeCachedSizesToFit = (layoutIndex) => {
    const { layoutCache } = this.state;
    const { paneset } = this.props;
    const layoutObject = layoutCache[layoutIndex];
    const layoutUnitTypes = {};
    let newCacheObject = {};
    if (!paneset) {
      // sum the pixels...
      let totalWidth = 0;
      let value;
      for (const p in layoutObject) {
        if (layoutObject[p]) {
          const unit = parseCSSUnit(layoutObject[p]);
          layoutUnitTypes[p] = unit;
          if (unit === 'px') {
            value = Math.ceil(parseInt(layoutObject[p], 10));
            totalWidth += value;
          } else if (unit === 'percent') {
            value = (parseFloat(layoutObject[p], 10) / 100) * (this.containerWidth || window.innerWidth);
            totalWidth += value;
          } else {
            return null;
          }
        }
      }

      // if all panes are non-pixel, resize the last pane
      // if the percentages don't add up to 100% for panesets of 3 or more panes
      if (Object.values(layoutUnitTypes).every((v) => (v === 'percent') || (v === 'vw'))) {
        const widths = Object.keys(layoutObject);
        if (widths.length > 2) {
          let totalPercentWidth = 0;
          const newWidth = {};
          widths.forEach((w, i) => {
            value = parseInt(layoutObject[w], 10);
            if (i === widths.length - 1) {
              newWidth.id = w;
              newWidth.defaultWidth = `${100 - totalPercentWidth}%`;
            } else {
              totalPercentWidth += value;
            }
          });
          newCacheObject = { ...newCacheObject, [newWidth.id]: newWidth.defaultWidth };

          this.previousContainerWidth = window.innerWidth;

          return { ...layoutObject, ...newCacheObject };
        }
        return null;
      }

      // if the window size has not changed, the cached pane widths may still need to be validated...
      if (Math.abs(this.previousContainerWidth - window.innerWidth) < 1) {
        if (Math.abs(this.previousContainerWidth - totalWidth) > 1) {
          const proportion = this.previousContainerWidth / totalWidth;
          for (const p in layoutObject) {
            if (layoutObject[p] && isUnitPixelBased(layoutUnitTypes[p])) {
              const newWidth = getNewPanewidthObject(p, layoutObject[p], proportion);
              newCacheObject = { ...newCacheObject, [newWidth.id]: newWidth.defaultWidth };
            }
          }
          this.previousContainerWidth = window.innerWidth;
          return { ...layoutObject, ...newCacheObject };
        } else {
          return layoutCache[layoutIndex];
        }
      } else {
        this.resizeToContainer();
      }
    }
    return null;
  }

  calcWidthsAndResize = (changeType) => {
    this.widthsRAF = requestAnimationFrame(() => {
      let widths;
      const nextLayout = {};
      this.state.panes.forEach(p => { nextLayout[p.id] = 0; });
      const sizesCached = this.cachedLayoutIndex(nextLayout);
      const toApply = this.props.onLayout({
        changeType,
        nextLayout,
        layoutCached: (sizesCached === -1),
        layoutCache: this.state.layoutCache,
        widths: sizesCached !== -1 ? null : this.state.layoutCache[sizesCached],
      });
      if (toApply !== null && sizesCached === -1) {
        widths = toApply;
      } else if (sizesCached !== -1) {
        widths = this.resizeCachedSizesToFit(sizesCached) || this.state.layoutCache[sizesCached];
      } else {
        widths = this.calcWidths(this.state.panes);
      }
      this.resizePanes(this.state.panes, widths);

      this.updateLayoutCache(widths, changeType);
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
    this.calcWidthsAndResize('endedTransition');
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
    const { paneset } = this.props;
    let staticSpace = 0;
    const dynamics = [];
    const resWidths = {};
    const container = this.getContainer();

    if (!container) {
      this.widths = resWidths;

      return resWidths;
    }

    let containerWidth = container.offsetWidth;

    // if containerWidth is 0, use the windowWidth to avoid dividing by 0...
    if (containerWidth === 0 && !paneset) {
      containerWidth = window.innerWidth;
    }

    panes.forEach((pane) => {
      if (pane.staticWidth && this.previousContainerWidth === containerWidth) {
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
        resWidths[pane.id] = `${basePercentage}%`;
      } else {
        resWidths[pane.id] = panes[i].defaultWidth;
      }
    });
    this.widths = resWidths;
    return resWidths;
  }

  getRef = () => this.container;
  getInstance = () => this;

  /**
   * cachedLayoutIndex
   * Search state.layoutCache for an object whose keys exactly match those
   * in the candidate.
   * @param {object} candidate
   * @returns int index in state.layoutCache of the matching cache, or -1
   */
  cachedLayoutIndex = (candidate) => {
    return this.state.layoutCache?.findIndex((cache) => {
      const cacheKeys = Object.keys(cache);
      const candidateKeys = Object.keys(candidate);
      if (cacheKeys.length === candidateKeys.length) {
        return cacheKeys.every(ck => candidateKeys.indexOf(ck) !== -1);
      }
      return false;
    }) ?? -1;
  };

  updateLayoutCache = (layoutMap) => {
    if (this.isThisMounted()) {
      this.setState(({ layoutCache }) => {
        // find duplicates with like lengths, id's...
        const layoutIndex = this.cachedLayoutIndex(layoutMap);
        if (layoutIndex !== -1) {
          const tempCache = cloneDeep(layoutCache);
          tempCache[layoutIndex] = layoutMap;
          return {
            layoutCache: tempCache
          };
        }
        return { layoutCache: [...layoutCache, layoutMap], changeType: 'resize' };
      }, () => {
        // only call the outside cache update IF all panes have non-generated ids.
        // otherwise, the cache is appended different every time a pane with a different generated id mounts.
        if (
          this.props.onResize &&
          this.state.panes.every((p) => p.hasGeneratedId === false)
        ) {
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
