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

### Display application specific keyboard shortcuts:

To display app specific keyboard shortcuts in the modal, you can make use of the `importShortcuts` and `renameShortcutLabels` utility functions

```import { importShortcuts, renameShortcutLabels } from '@folio/stripes-components'

// To import app specific shortcuts

const appSpecificShortcuts = importShortcuts(['new', 'save'])

// To rename labels to be displayed in the shortcuts modal

const renamedShortcuts = renameShortcutLabels(appSpecificShortcuts,
  [
    {'shortcut': 'new', 'label': 'new resource'},
    {'shortcut': 'save', 'label': 'save resource'}
  ]
);

<KeyboardShortcutsModal
    onClose={() => { this.changeKeyboardShortcutsModal(false); }}
    allCommands={renamedShortcuts}
/>
```
## Core shortcuts
There are a few core shortcuts that get displayed by default in the shortcuts modal and need not be included when specifying the shortcuts at the application level. These include:
* openShortcutsModal
* closeModal
* Copy
* Cut
* Paste
* Find

## Props
Name | Type | Description
-- | -- | --
allCommands | array of object | The list of shortcuts to be displayed.
onClose | func | Callback fired when the modal is closed using its dismiss button.
