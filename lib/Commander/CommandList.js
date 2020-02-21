import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from '../HotKeys';
import { isRestricted } from './RestrictedShortcuts';

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

  componentDidMount() {
    const { commands } = this.props;
    commands.forEach(c => this.registerCommand(c));
  }

  registerCommand({
    name,
    shortcut,
  }) {
    const keys = shortcut.split(' ');
    const warnings = [];

    keys.forEach((k) => {
      const restrictedIndex = isRestricted(k);
      if (restrictedIndex !== -1) {
        warnings.push(`"${shortcut}", \
requested for "${name}" is a system shortcut \
(${restrictedIndex.desc}) and care should be taken in assigning it.`);
      }
    });


    if (warnings.length !== 0) {
      warnings.forEach(w => {
        console.warn(w); // eslint-disable-line
      });
    }
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
      <HotKeys id={id} {...this.generateHotKeysProps()} noWrapper>
        {children}
      </HotKeys>
    );
  }
}

export default CommandList;
