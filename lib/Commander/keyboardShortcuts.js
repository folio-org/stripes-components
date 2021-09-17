import React from 'react';
import { FormattedMessage } from 'react-intl';
import mapValues from 'lodash/mapValues';

const expandAllSections = (e, accordionStatusRef) => {
  e.preventDefault();
  const { state, setStatus } = accordionStatusRef.current;
  setStatus(() => mapValues(state, () => true));
};

const collapseAllSections = (e, accordionStatusRef) => {
  e.preventDefault();
  const { state, setStatus } = accordionStatusRef.current;
  setStatus(() => mapValues(state, () => false));
};

const checkScope = () => {
  return document.body.contains(document.activeElement);
};

const defaultKeyboardShortcuts = [
  {
    label: (<FormattedMessage id="stripes-components.shortcut.createRecord" />),
    name: 'new',
    shortcut: 'alt + n',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.editRecord" />),
    name: 'edit',
    shortcut: 'mod + alt + e',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.saveRecord" />),
    name: 'save',
    shortcut: 'mod + s',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.duplicateRecord" />),
    name: 'duplicateRecord',
    shortcut: 'alt + c',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.expandAll" />),
    name: 'expandAllSections',
    shortcut: 'mod + alt + b'
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.collapseAll" />),
    name: 'collapseAllSections',
    shortcut: 'mod + alt + g'
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.expandOrCollapse" />),
    name: 'expandOrCollapseAccordion',
    shortcut: 'spacebar'
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.goToSearchFilter" />),
    name: 'search',
    shortcut: 'mod + alt + h',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.openShortcutModal" />),
    name: 'openShortcutModal',
    shortcut: 'mod + alt + k',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.closeModal" />),
    name: 'closeModal',
    shortcut: 'esc',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.copy" />),
    name: 'copy',
    shortcut: 'mod + c',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.cut" />),
    name: 'cut',
    shortcut: 'mod + x',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.paste" />),
    name: 'paste',
    shortcut: 'mod + v',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.find" />),
    name: 'find',
    shortcut: 'mod + f',
  },
];

// list of default keyboard shortcut names ['new', 'edit', 'save']
const keyboardShortcutNames = defaultKeyboardShortcuts.map(({ name }) => name);

/* function to import specific shortcuts relevant to the app. Takes in an array with
   shortcut names ['new', 'save', 'duplicateRecord'] and returns an array of requested
   shortcuts entries from the defaultKeyboardShortcuts array prserving the order of entries */
const importShortcuts = (shortcutNamesArray = []) => {
  const filteresShortcutsArray = []; // array that contains specific requested shortcuts from the app

  for (const shortcut of defaultKeyboardShortcuts) {
    if (shortcutNamesArray.find(shortcutName => shortcutName?.toLowerCase() === shortcut?.name?.toLowerCase())) {
      filteresShortcutsArray.push(shortcut);
    }
  }

  return filteresShortcutsArray;
};

/* function that overrides the labels of the default shortcuts to be displayed
   Eg: The 'new' default shortcut renders its label as `New`. If the app wants it displayed as `New resource` instead,
   you could call the renameShortcutLabels function as
   `renameShortcutLabels(shortcutsArray, [{ 'shortcut': 'new', 'label': '<FormatedMessage id="ui-app.newResource'}]
   Note: shortcutsArray contains the list of shortcuts with labels you want to be modified. eg: defaultKeyboardShortcuts
*/
const renameShortcutLabels = (shortcutsArray = [], newLabelsArray = []) => {
  if (newLabelsArray.length === 0) return shortcutsArray;

  return shortcutsArray.map(shortcutObj => {
    const { name } = shortcutObj;
    const entryWithShortcut = newLabelsArray.find(({ shortcut }) => shortcut?.toLowerCase() === name?.toLowerCase());
    return entryWithShortcut ? { ...shortcutObj, label: entryWithShortcut.label } : shortcutObj;
  });
};

export {
  expandAllSections,
  collapseAllSections,
  checkScope,
  defaultKeyboardShortcuts,
  keyboardShortcutNames,
  importShortcuts,
  renameShortcutLabels
};
