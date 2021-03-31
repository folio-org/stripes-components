# KeyboardShortcutsModal

Display keyboard shortcuts that can be used to navigate a Folio app by keyboard.

## Basic Usage

```
import { KeyboardShortcutsModal } from '@folio/stripes/components';

const commands = [
  {
    label: 'Copy',
    shortcut: 'mod+c'
  },
  {
    label: 'Paste',
    shortcut: 'mod+v'
  }
];

{ this.state.showKeyboardShortcutsModal && (
  <KeyboardShortcutsModal
    onClose={() => { this.changeKeyboardShortcutsModal(false); }}
    allCommands={commands}
  />
)}
```

## Props
Name | Type | Description
-- | -- | --
allCommands | array of object | The list of shortcuts to be displayed.
onClose | func | Callback fired when the modal is closed using its dismiss button.
