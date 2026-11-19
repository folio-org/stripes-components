import React, { useState } from 'react';
import Button from '../../../lib/Button';
import KeyboardShortcutsModal from '../../../lib/KeyboardShortcutsModal';

const commands = [
  { label: 'Create record', shortcut: 'mod+n' },
  { label: 'Save changes', shortcut: 'mod+s' },
];

export default function MiniKeyboardShortcutsModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button buttonStyle="primary" onClick={() => setOpen(true)}>Open modal</Button>
      {open && (
        <KeyboardShortcutsModal
          allCommands={commands}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
