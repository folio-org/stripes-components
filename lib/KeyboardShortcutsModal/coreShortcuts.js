import FormattedMessage from 'react-intl';

const coreShortcuts = [
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

export default coreShortcuts;
