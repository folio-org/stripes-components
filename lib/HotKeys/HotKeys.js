import React from "react";
import PropTypes from "prop-types";
import FocusTrap from "./FocusTrap";
import contains from './contains';
import isEqual from "lodash/isEqual";
import isBool from "lodash/isBoolean";
import omit from "lodash/omit";
import { withHotKeys, HotKeysProvider } from "./HotKeysContext";
import Keyboard from "keyboardjs/lib/keyboard";
import usLocale from "keyboardjs/locales/us";

const buildMap = (currentMap = {}, contextMap = {}, propsMap = {}) => ({ ...currentMap, ...contextMap, ...propsMap });

const updateMap = (
  contextMap = {},
  propsMap = {},
  currentMap = {},
  previousMap = {},
) => {
  const nextMap = buildMap(currentMap, contextMap, propsMap);

  if (!isEqual(nextMap, previousMap)) {
    return nextMap;
  }
  return null;
};

const getSequencesFromMap = (hotKeyName, hotKeyMap = {},) => {
  const sequences = hotKeyMap ? hotKeyMap[hotKeyName] : null;

  // if hotkeymapping is null, return the null sequence...
  // If no sequence is found with this name (undefined) we assume
  // the user is passing a hard-coded sequence as a key
  if (!sequences) {
    return sequences === null ? [] : [hotKeyName];
  }

  if (Array.isArray(sequences)) {
    return sequences;
  } else if (typeof sequences === 'object') {
    return getSequencesFromMap('sequence', sequences);
  }

  return [sequences];
};

const buildBindArray = (bindArray, wrapper, handlers, keyMap) => {
  Object.keys(handlers).forEach(h => {
    let sequences = getSequencesFromMap(h, keyMap);

    // if no keyMap entry is present, assume the handler's key *is*
    // the keyCombo (a hard-coded sequence like "enter" or "ctrl + e".)
    // if (!keyCombo) {
    //   keyCombo = h;
    // }
    sequences.forEach((keyCombo) => {

      if (handlers[h] && // avoid undefined handler functions
        !bindArray.some((w) => w.keyCombo === keyCombo)) { // avoid duplicate keyCombos
        const wrapped = {
          keyCombo,
          fn: e => {
            wrapper(e, handlers[h], keyCombo);
          }
        };
        bindArray.push(wrapped);
      }
    });
  });
};

class HotKeys extends React.Component {
  static propTypes = {
    HKcontext: PropTypes.object,
    keyMap: PropTypes.object,
    handlers: PropTypes.object
  };

  constructor(props) {
    super(props);

    const { childHandledSequence } = this;

    this.state = {
      timestamp: undefined,
      HKcontext: {
        hotKeyParent: {
          childHandledSequence
        },
        hotKeyMap: {}
      }
    };

    this.keyboardjs = null;
    this.isFocused = false;
    this.lastChildSequence = null;
    this.localKeybindings = [];
  }

  static getDerivedStateFromProps(props, state) {
    const nextMap = updateMap(
      props.HKcontext.hotKeyMap,
      props.keyMap,
      {},
      state.HKcontext.hotKeyMap
    );

    if (nextMap) {
      return {
        HKcontext: {
          ...state.HKcontext, hotKeyMap: nextMap
        }
      };
    }

    return null;
  }

  componentDidMount() {
    const { attach } = this.props;

    // handle refs...
    if (attach) {
      this.attachment = attach.current ? attach.current : attach;
    }

    if (!this.attachment) {
      console.warn(`Uhoh; called HotKeys with null attach; no listeners can be configured`);
      return;
    }

    this.keyboardjs = new Keyboard(this.attachment);
    this.keyboardjs.setLocale("us", usLocale);
    this.updateHotKeys(true);

    // if focus is already contained here, set isFocused to true...
    // this can happen when autoFocus is used on child elements...
    if (contains(this.attachment, document.activeElement)) {
      this.isFocused = true;
    }
    // if an attachment wasn't included, re-render to pick up the attachment node in FocusTrap.
    if (attach === 'undefined') this.forceUpdate();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.attachment) {
      console.warn('HotKeys was incorrectly instantiated without "attach"!')
      return;
    }
    this.updateHotKeys(false, prevProps, prevState);
    if (!isEqual(prevProps.keyMap, this.props.keyMap)) {
      this.setState({ timeStamp: Date.now() });
    }
  }

  componentWillUnmount() {
    const {
      HKcontext: { hotKeyParent }
    } = this.props;
    if (hotKeyParent) {
      hotKeyParent.childHandledSequence(null);
    }

    if (this.keyboardjs) {
      this.keyboardjs.stop();
      this.localKeybindings = [];
    }
  }

  handlerWrapper = (e, handler, sequence) => {
    const { focused } = this.props;
    // Check we are actually in focus and that a child hasn't handled the sequence...
    let isFocused = this.isFocused;
    if (isBool(focused)) {
      // if a boolean is used for the focused prop, make sure the e.target is contained.
      // this keeps sibling HotKeys instances from firing handlers for similar key mapping.
      if (contains(this.attachment, e.target)) {
        isFocused = focused;
      }
    } else if (typeof focused === "function") {
      isFocused = focused();
    }

    if (isFocused && sequence !== this.lastChildSequence) {
      if (this.props.HKcontext.hotKeyParent) {
        this.props.HKcontext.hotKeyParent.childHandledSequence(sequence);
      }

      handler(e);
    }
  };

  updateHotKeys = (force = false, prevProps = {}, prevState = {}) => {
    const { handlers = {}, keyMap, HKcontext = {} } = this.props;
    const {
      HKcontext: { hotKeyMap: combinedKeyMap }
    } = this.state;

    const prevHandlers = prevProps.handlers || {};

    if (
      !force &&
      !updateMap(HKcontext.hotKeyMap, combinedKeyMap, keyMap, prevState?.HKcontext.hotKeyMap) &&
      isEqual(handlers, prevHandlers)
    ) {
      return;
    }

    this.keyboardjs.stop(); // removes any keys from kbjs's queue, unbinds its listeners.
    this.keyboardjs.reset(); // removes all listeners
    this.localKeybindings = [];
    // bind local keys first, preferring their keyMapped sequences over potential duplicates from context.
    buildBindArray(
      this.localKeybindings,
      this.handlerWrapper,
      handlers,
      keyMap
    );
    // add keys from context into binding array...
    buildBindArray(
      this.localKeybindings,
      this.handlerWrapper,
      handlers,
      combinedKeyMap
    );
    if (this.localKeybindings.length !== 0) {
      // finally bind keys...
      this.localKeybindings.forEach((k) => {
        this.keyboardjs.on(k.keyCombo, k.fn);
      });
      // and watch... (we don't even watch if no key bindings were stored)
      this.keyboardjs.watch(this.attachment);
    }

  };

  childHandledSequence = (sequence = null) => {
    const {
      HKcontext: { hotKeyParent }
    } = this.props;
    this.lastChildSequence = sequence;

    // Travers up to any contextual parents, leting them know we handled it...
    if (hotKeyParent) {
      hotKeyParent.childHandledSequence(sequence);
    }
  };

  onFocus = (...args) => {
    this.isFocused = true;

    if (this.props.onFocus) {
      this.props.onFocus(...args);
    }
  };

  onBlur = (...args) => {
    const {
      HKcontext: { hotKeyParent },
      onBlur
    } = this.props;

    this.isFocused = false;

    if (onBlur) {
      onBlur(...args);
    }

    // clear keyboardJS' array of previously pressed keys..
    this.keyboardjs.releaseAllKeys();
    if (hotKeyParent) {
      hotKeyParent.childHandledSequence(null);
    }
  };

  render() {
    const {
      children,
    } = this.props;

    const focusTrapProps = omit(
      this.props,
      'keyMap',
      'handlers',
      'focused',
      'attach',
      'HKcontext'
    );

    return (
      <HotKeysProvider value={this.state.HKcontext}>
        <FocusTrap {...focusTrapProps} onFocus={this.onFocus} onBlur={this.onBlur} element={this.attachment}>
          {children}
        </FocusTrap>
      </HotKeysProvider>
    );
  }
}

export default withHotKeys(HotKeys);
