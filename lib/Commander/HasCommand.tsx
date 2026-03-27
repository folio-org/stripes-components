// @ts-nocheck
/*
 * HasCommand applies a keyboard shortcut to a wrapped section of the UI
 * Given a 'name' prop, it assigns a handler function to the associated
 * Shortcut from a parent 'CommandList'
 */

import React from "react";
import isEqual from "lodash/isEqual";
import { HotKeys } from "../HotKeys";
type HasCommandProps = {
  children: React.ReactNode | React.ReactNode[];
  commands?: Record<string, any>[];
  id?: string;
  isWithinScope?: (...args: any[]) => any;
  scope?: React.ReactNode | Element | Record<string, any>;
};

class HasCommand extends React.Component<HasCommandProps> {
  constructor(props) {
    super(props);

    this.getHandlers = this.getHandlers.bind(this);
    this.getKeyMap = this.getKeyMap.bind(this);

    this.handlers = this.getHandlers();
    this.keyMap = this.getKeyMap();
  }

  componentDidUpdate(prevProps) {
    const { commands } = this.props;
    if (!isEqual(commands, prevProps.commands)) {
      this.handlers = this.getHandlers();
      this.keyMap = this.getKeyMap();
      this.forceUpdate();
    }
  }

  getHandlers() {
    const { commands } = this.props;
    const handlers = {};
    commands.forEach((c) => {
      if (c.handler) {
        handlers[c.name] = c.handler;
      }
    });
    return handlers;
  }

  getKeyMap() {
    const { commands } = this.props;
    const keyMap = {};
    commands.forEach((c) => {
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
    const { children, id, isWithinScope, scope } = this.props;
    return (
      <HotKeys
        id={id}
        keyMap={this.keyMap}
        handlers={this.handlers}
        focused={isWithinScope}
        attach={scope}
        noWrapper
      >
        {children}
      </HotKeys>
    );
  }
}

export default HasCommand;
