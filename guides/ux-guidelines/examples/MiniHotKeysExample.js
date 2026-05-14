import React from 'react';
import TextField from '../../../lib/TextField';
import { HotKeys } from '../../../lib/HotKeys';

const keyMap = {
  save: ['mod+s'],
};

const handlers = {
  save: (event) => {
    event.preventDefault();
  },
};

export default function MiniHotKeysExample() {
  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <TextField
        label="Title"
        value="Keyboard shortcut enabled"
        onChange={() => { }}
      />
    </HotKeys>
  );
}
