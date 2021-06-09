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
    name: 'save',
    shortcut: 'mod+s',
  },
  {
    name: 'new',
    shortcut: 'alt+n',
  },
  {
    name: 'search',
    shortcut: 'mod+alt+h',
  },
  {
    name: 'edit',
    shortcut: 'mod+alt+e',
  },
  {
    name: 'expandAllSections',
    shortcut: 'mod+alt+b'
  },
  {
    name: 'collapseAllSections',
    shortcut: 'mod+alt+g'
  },
  {
    name: 'duplicateRecord',
    shortcut: 'alt+c',
  },
  {
    name: 'viewKeyboardShortcuts',
    shortcut: 'mod+alt+k',
  },
];

export {
  expandAllSections,
  collapseAllSections,
  checkScope,
  defaultKeyboardShortcuts,
};
