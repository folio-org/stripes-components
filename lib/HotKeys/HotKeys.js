import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import isBool from 'lodash/isBoolean';
import omit from 'lodash/omit';
import { useHotkeys } from 'react-hotkeys-hook';
import FocusTrap from './FocusTrap';
import contains from './contains';
import { withHotKeys, HotKeysProvider } from './HotKeysContext';

const buildMap = (currentMap = {}, contextMap = {}, propsMap = {}) => ({ ...currentMap, ...contextMap, ...propsMap });

const getSequencesFromMap = (hotKeyName, hotKeyMap = {}) => {
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

const resolveAttachment = (attach) => {
  if (!attach) {
    return null;
  }

  if (typeof attach === 'object' && 'current' in attach) {
    return attach.current;
  }

  return attach;
};

const buildBindings = (handlers = {}, keyMap = {}, contextMap = {}) => {
  const bindings = new Map();

  const addBindings = (hotKeyMap = {}) => {
    Object.keys(handlers).forEach((handlerName) => {
      const handler = handlers[handlerName];
      const sequences = getSequencesFromMap(handlerName, hotKeyMap);

      sequences.forEach((keyCombo) => {
        if (handler && !bindings.has(keyCombo)) {
          bindings.set(keyCombo, { keyCombo, handler });
        }
      });
    });
  };

  // Prefer explicit local bindings over inherited context bindings.
  addBindings(keyMap);
  addBindings(contextMap);

  return Array.from(bindings.values());
};

const HotKeys = (props) => {
  const {
    HKcontext = {},
    attach,
    focused,
    handlers = {},
    keyMap = {},
    onBlur,
    onFocus,
  } = props;

  const [attachment, setAttachment] = useState(() => resolveAttachment(attach));
  const isFocusedRef = useRef(false);
  const lastChildSequenceRef = useRef(null);

  const hotKeyMap = useMemo(
    () => buildMap({}, HKcontext.hotKeyMap, keyMap),
    [HKcontext.hotKeyMap, keyMap],
  );

  const childHandledSequence = useCallback((sequence = null) => {
    lastChildSequenceRef.current = sequence;

    if (HKcontext.hotKeyParent) {
      HKcontext.hotKeyParent.childHandledSequence(sequence);
    }
  }, [HKcontext.hotKeyParent]);

  useEffect(() => {
    const nextAttachment = resolveAttachment(attach);

    if (nextAttachment !== attachment) {
      setAttachment(nextAttachment);
    }
  }, [attach, attachment]);

  const bindings = useMemo(
    () => buildBindings(handlers, keyMap, HKcontext.hotKeyMap),
    [HKcontext.hotKeyMap, handlers, keyMap],
  );

  const hotkeysRef = useHotkeys(
    bindings.map(({ keyCombo }) => keyCombo),
    (event, hotkeyEvent) => {
      const binding = bindings.find(({ keyCombo }) => keyCombo === hotkeyEvent.hotkey);

      if (!binding) {
        return;
      }

      // Check we are actually in focus and that a child hasn't handled the sequence.
      let isFocused = isFocusedRef.current;
      if (isBool(focused)) {
        // if a boolean is used for the focused prop, make sure the e.target is contained.
        // this keeps sibling HotKeys instances from firing handlers for similar key mapping.
        if (contains(attachment, event.target)) {
          isFocused = focused;
        }
      } else if (typeof focused === 'function') {
        isFocused = focused();
      }

      if (isFocused && hotkeyEvent.hotkey !== lastChildSequenceRef.current) {
        if (HKcontext.hotKeyParent) {
          HKcontext.hotKeyParent.childHandledSequence(hotkeyEvent.hotkey);
        }

        event.stopPropagation();
        binding.handler(event);
      }
    },
    [attachment, focused, bindings, HKcontext.hotKeyParent],
  );

  const providerValue = useMemo(
    () => ({
      hotKeyParent: {
        childHandledSequence,
      },
      hotKeyMap,
    }),
    [childHandledSequence, hotKeyMap],
  );

  useEffect(() => {
    hotkeysRef(attachment);

    return () => {
      hotkeysRef(null);
    };
  }, [attachment, hotkeysRef]);

  useEffect(() => {
    return () => {
      const { hotKeyParent } = HKcontext;

      if (hotKeyParent) {
        hotKeyParent.childHandledSequence(null);
      }
    };
  }, [HKcontext.hotKeyParent]);

  const onFocusHandler = (...args) => {
    isFocusedRef.current = true;

    if (onFocus) {
      onFocus(...args);
    }
  };

  const onBlurHandler = (...args) => {
    const { hotKeyParent } = HKcontext;

    isFocusedRef.current = false;

    if (onBlur) {
      onBlur(...args);
    }

    if (hotKeyParent) {
      hotKeyParent.childHandledSequence(null);
    }
  };

  const focusTrapProps = omit(
    props,
    'keyMap',
    'handlers',
    'focused',
    'attach',
    'HKcontext',
  );

  return (
    <HotKeysProvider value={providerValue}>
      <FocusTrap
        {...focusTrapProps}
        element={attachment}
        elementRef={setAttachment}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
      >
        {props.children}
      </FocusTrap>
    </HotKeysProvider>
  );
};

HotKeys.propTypes = {
  HKcontext: PropTypes.object,
  attach: PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
  children: PropTypes.node,
  focused: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  handlers: PropTypes.object,
  keyMap: PropTypes.object,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

export default withHotKeys(HotKeys);
