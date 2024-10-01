import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from '../HotKeys';

class CommandList extends Component {
  static propTypes = {
    attach: PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
    children: PropTypes.node,
    commands: PropTypes.arrayOf(
      PropTypes.shape({
        handler: PropTypes.func,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.node]),
        name: PropTypes.string.isRequired,
        shortcut: PropTypes.string,
      })
    ).isRequired,
    id: PropTypes.string,
  };

  generateHotKeysProps() {
    const {
      commands
    } = this.props;

    const keyMap = {};
    const handlers = {};
    commands.forEach((c) => {
      keyMap[c.name] = c.shortcut || '';
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
    const {
      children,
      id,
      attach
    } = this.props;

    return (
      <HotKeys id={id} {...this.generateHotKeysProps()} attach={attach || document.body} noWrapper>
        {children}
      </HotKeys>
    );
  }
}

export default CommandList;
