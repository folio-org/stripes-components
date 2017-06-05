import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import isBool from 'lodash/isBoolean';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';

function getDisplayName(WrappedComponent) {
  return  WrappedComponent.displayName || 
          WrappedComponent.name || 
          'Component'
}

function getSequencesFromMap(hotKeyMap, hotKeyName) {
  const sequences = hotKeyMap[hotKeyName];

  // If no sequence is found with this name we assume
  // the user is passing a hard-coded sequence as a key
  if (!sequences) {
    return [hotKeyName];
  }

  if (isArray(sequences)) {
    return sequences;
  }

  return [sequences];
}

function HotKeysHOC(WrappedComponent) {

  return class HOC extends WrappedComponent {
    constructor(props) {
      super(props);

      this.___isFocused___ = false;
      this.___hotKeyMap___ = this.props.keyMap;
      this.___focusTrap___ = null;
      this.___mouseTrap___ = null;
      this.__lastChildSequence__ = null;

      this.onFocus = this.onFocus.bind(this);
      this.onBlur = this.onBlur.bind(this);
      this.updateMap = this.updateMap.bind(this);
      this.getMap = this.getMap.bind(this);
      this.buildMap = this.buildMap.bind(this);
      this.updateHotKeys = this.updateHotKeys.bind(this);
      this.childHandledSequence = this.childHandledSequence.bind(this);
    }

    static propTypes = {
      children: PropTypes.node,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      keyMap: PropTypes.object,
      handlers: PropTypes.object,
      focused: PropTypes.bool, // externally controlled focus
      attach: PropTypes.any, // dom element to listen for key events
      tabIndex: PropTypes.string,
    }

    static defaultProps = {
      tabIndex: '-1',
    }

    static contextTypes = Object.assign({}, WrappedComponent.contextTypes, {
      hotKeyMap: PropTypes.object
    });

    static childContextTypes = Object.assign({}, WrappedComponent.childContextTypes, {
      hotKeyMap: PropTypes.object
    });

    static displayName = `Keyable((${getDisplayName(WrappedComponent)})`;

    componentDidMount() {
      // import is here to support React's server rendering as Mousetrap immediately
      // calls itself with window and it fails in Node environment
      const Mousetrap = require('mousetrap');
      // Not optimal - imagine hundreds of this component. We need a top level
      // delegation point for mousetrap
      this.__mousetrap__ = new Mousetrap(
        this.props.attach || this.___focusTrap___ || ReactDOM.findDOMNode(this)
      );

      this.updateHotKeys(true);
      super.componentDidMount();
    }

    getChildContext() {
      const wrappedCC = super.getChildContext ? super.getChildContext() : {};
      return Object.assign({}, wrappedCC, {
        hotKeyMap: this.__hotKeyMap__
      });
    }

    componentWillMount() {
      this.updateMap();
      super.componentWillMount();
    }

    componentWillUnmount() {
      if (this.context.hotKeyParent) {
        this.context.hotKeyParent.childHandledSequence(null);
      }

      if (this.__mousetrap__) {
        this.__mousetrap__.reset();
      }
    }

    updateMap() {
      const newMap = this.buildMap();

      if (!isEqual(newMap, this.__hotKeyMap__)) {
        this.__hotKeyMap__ = newMap;
        return true;
      }

      return false;
    }

    updateHotKeys(force = false, prevProps = {}) {
      const { handlers = {} } = this.props;
      const { handlers: prevHandlers = handlers } = prevProps;

      // Ensure map is up-to-date to begin with
      // We will only bother continuing if the map was actually updated
      if (!force && !this.updateMap() && isEqual(handlers, prevHandlers)) {
        return;
      }

      const hotKeyMap = this.getMap();
      const sequenceHandlers = [];
      const mousetrap = this.__mousetrap__;

      // Group all our handlers by sequence
      forEach(handlers, (handler, hotKey) => {
        const handlerSequences = getSequencesFromMap(hotKeyMap, hotKey);

        // Could be optimized as every handler will get called across every bound
        // component - imagine making a node a focus point and then having hundreds!
        forEach(handlerSequences, (sequence) => {
          let action;

          const callback = (event, sequence) => {
            // Check we are actually in focus and that a child hasn't already handled this sequence
            const isFocused = isBool(this.props.focused)
              ? this.props.focused
              : this.__isFocused__;

            if (isFocused && sequence !== this.__lastChildSequence__) {
              if (this.context.hotKeyParent) {
                this.context.hotKeyParent.childHandledSequence(sequence);
              }

              return handler(event, sequence);
            }
          };

          if (isObject(sequence)) {
            action = sequence.action;
            sequence = sequence.sequence;
          }

          sequenceHandlers.push({ callback, action, sequence });
        });
      });

      // Hard reset our handlers (probably could be more efficient)
      mousetrap.reset();
      forEach(sequenceHandlers, (handler) =>
        mousetrap.bind(handler.sequence, handler.callback, handler.action));
    }

    buildMap() {
      const parentMap = this.context.hotKeyMap || {};
      const thisMap = this.props.keyMap || {};

      return Object.assign({}, parentMap, thisMap);
    }

    getMap() {
      return this.__hotKeyMap__;
    }

    childHandledSequence(sequence = null) {
      this.__lastChildSequence__ = sequence;

      // Traverse up any hot key parents so everyone is aware a child has handled a certain sequence
      if (this.context.hotKeyParent) {
        this.context.hotKeyParent.childHandledSequence(sequence);
      }
    }

    onFocus() {
      this.__isFocused__ = true;

      if (this.props.onFocus) {
        this.props.onFocus(...arguments);
      }
    }

    onBlur() {
      this.__isFocused__ = false;

      if (this.props.onBlur) {
        this.props.onBlur(...arguments);
      }
      if (this.context.hotKeyParent) {
        this.context.hotKeyParent.childHandledSequence(null);
      }
    }

    render() {
      // get the rendered output of the wrapped component
      const elementsTree = super.render();
      let newProps = {};
      if (!elementsTree.props.hasOwnProperty('tabIndex')) {
        newProps.tabIndex = this.props.tabIndex;
      }

      newProps.onBlur = this.onBlur;
      newProps.onFocus = this.onFocus;
      newProps.ref = (ref) => {this.___focusTrap___ = ref;}

      const props = Object.assign({}, elementsTree.props, newProps);
      const newElementsTree = React.cloneElement(elementsTree, props, elementsTree.props.children);
      return newElementsTree;
    }
  }
}

export default HotKeysHOC;