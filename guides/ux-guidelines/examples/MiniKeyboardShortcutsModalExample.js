import React from 'react';
import KeyboardShortcutsModal from '../../../lib/KeyboardShortcutsModal';

const commands = [
  { label: 'Create record', shortcut: 'mod+n' },
  { label: 'Save changes', shortcut: 'mod+s' },
];

export default function MiniKeyboardShortcutsModalExample() {
  return (
    <KeyboardShortcutsModal
      allCommands={commands}
      onClose={() => { }}
    />
  );
}
