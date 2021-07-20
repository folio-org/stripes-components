import { upperFirst } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import Modal from '../Modal';
import ModalFooter from '../ModalFooter';
import MultiColumnList from '../MultiColumnList';

function KeyboardShortcutsModal(props) {
  const { onClose, allCommands } = props;

  const footer = (
    <ModalFooter>
      <Button
        data-test-shortcuts-close-button
        id="keyboard-shortcuts-modal-close"
        onClick={onClose}
      >
        <FormattedMessage id="stripes-components.close" />
      </Button>
    </ModalFooter>
  );

  const platform = window.navigator.platform;
  const shortcutsData = [];
  allCommands.forEach(key => {
    let value = {};
    let shortcut = '';
    const shortcutCommand = key.shortcut.replace(/ /g, '').split('+');
    const commandArray = [];
    for (let i = 0; i < shortcutCommand.length; i++) {
      commandArray.push(upperFirst(shortcutCommand[i].toLowerCase()));
    }

    if (platform.includes('Mac')) {
      shortcut = commandArray.join(' + ').replace('Mod', 'Cmd').replace('Alt', 'Option');
    } else {
      shortcut = commandArray.join(' + ').replace('Mod', 'Ctrl');
    }

    value = {
      'action': key.label,
      'shortcut': shortcut,
    };

    shortcutsData.push(value);
  });

  const columnMapping = {
    action: <FormattedMessage id="stripes-components.shortcut.action" />,
    shortcut: <FormattedMessage id="stripes-components.shortcut.shortcut" />,
  };

  const columnWidths = {
    'action': '50%',
    'shortcut': '50%',
  };

  return (
    <Modal
      autosize
      data-test-keyboard-shortcuts-modal
      dismissible
      footer={footer}
      id="keyboard-shortcuts-modal"
      label={<FormattedMessage id="stripes-components.shortcut.modalLabel" />}
      onClose={onClose}
      open
    >
      <div>
        <MultiColumnList
          columnMapping={columnMapping}
          columnWidths={columnWidths}
          contentData={shortcutsData}
          interactive={false}
        />
      </div>
    </Modal>
  );
}

KeyboardShortcutsModal.propTypes = {
  allCommands: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func.isRequired,
};

export default KeyboardShortcutsModal;
