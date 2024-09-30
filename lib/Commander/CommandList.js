import React, { Component, createRef } from 'react';
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

  constructor(props) {
    super(props);
    this.shortcutRef = createRef(null);
  }

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
      <HotKeys id={id} {...this.generateHotKeysProps()} attach={this.shortcutRef.current} noWrapper>
        <div ref={this.shortcutRef}>
        {children}
        </div>
      </HotKeys>
    );
  }
}

export default CommandList;
