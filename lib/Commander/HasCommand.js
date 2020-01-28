/*
* HasCommand applies a keyboard shortcut to a wrapped section of the UI
* Given a 'name' prop, it assigns a handler function to the associated
* Shortcut from a parent 'CommandList'
*/

import React from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from '../HotKeys';

class HasCommand extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
    commands: PropTypes.arrayOf(PropTypes.object),
    isWithinScope: PropTypes.func,
    scope: PropTypes.oneOfType([PropTypes.node, PropTypes.instanceOf(Element), PropTypes.object])
  }

  constructor(props) {
    super(props);

    this.getHandlers = this.getHandlers.bind(this);
    this.getKeyMap = this.getKeyMap.bind(this);

    this.handlers = this.getHandlers();
    this.keyMap = this.getKeyMap();
  }

  getHandlers() {
    const { commands } = this.props;
    const handlers = {};
    commands.forEach(c => {
      if (c.handler) {
        handlers[c.name] = c.handler;
      }
    });
    return handlers;
  }

  getKeyMap() {
    const { commands } = this.props;
    const keyMap = {};
    commands.forEach(c => {
      if (c.shortcut) {
        keyMap[c.name] = c.shortcut;
      }
    });
    if (Object.keys(keyMap).length === 0) {
      return null;
    }
    return keyMap;
  }

  render() {
    const { children, isWithinScope, scope } = this.props;
    return (
      <HotKeys
        keyMap={this.keyMap}
        handlers={this.handlers}
        focused={isWithinScope}
        attach={scope}
        noWrapper
      >
        { children }
      </HotKeys>
    );
  }
}

export default HasCommand;
