import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from '../HotKeys';

class CommandList extends Component {
  static propTypes = {
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
      id
    } = this.props;

    return (
      <HotKeys id={id} {...this.generateHotKeysProps()} noWrapper>
        {children}
      </HotKeys>
    );
  }
}

export default CommandList;
