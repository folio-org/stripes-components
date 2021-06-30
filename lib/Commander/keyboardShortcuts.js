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
    label: (<FormattedMessage id="stripes-components.shortcut.saveRecord" />),
    name: 'save',
    shortcut: 'mod + s',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.createRecord" />),
    name: 'new',
    shortcut: 'alt + n',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.goToSearchFilter" />),
    name: 'search',
    shortcut: 'mod + alt + h',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.editRecord" />),
    name: 'edit',
    shortcut: 'mod + alt + e',
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
    label: (<FormattedMessage id="stripes-components.shortcut.duplicateRecord" />),
    name: 'duplicateRecord',
    shortcut: 'alt + c',
  },
  {
    label: (<FormattedMessage id="stripes-components.shortcut.openShortcutModal" />),
    name: 'openShortcutModal',
    shortcut: 'mod + alt + k',
  },
];

export {
  expandAllSections,
  collapseAllSections,
  checkScope,
  defaultKeyboardShortcuts,
};
