// @ts-nocheck
import React, { Component, createRef } from "react";
import { HotKeys } from "../HotKeys";
type CommandListProps = {
  attach?: React.ReactElement | Record<string, any>;
  children?: React.ReactNode;
  commands: {
    handler?: (...args: any[]) => any;
    label?: string | ((...args: any[]) => any) | React.ReactNode;
    name: string;
    shortcut?: string;
  }[];
  id?: string;
};

class CommandList extends Component<CommandListProps> {
  generateHotKeysProps() {
    const { commands } = this.props;

    const keyMap = {};
    const handlers = {};
    commands.forEach((c) => {
      keyMap[c.name] = c.shortcut || "";
      if (c.handler) {
        handlers[c.name] = c.handler;
      }
    });

    return {
      keyMap,
      handlers,
    };
  }

  render() {
    const { children, id, attach } = this.props;

    return (
      <HotKeys
        id={id}
        {...this.generateHotKeysProps()}
        attach={attach || document.body}
        noWrapper
      >
        {children}
      </HotKeys>
    );
  }
}

export default CommandList;
