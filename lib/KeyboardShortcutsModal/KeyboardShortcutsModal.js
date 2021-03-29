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
        id="keyboard-shortcuts-modal-close"
        onClick={onClose}
      >
        <FormattedMessage id="ui-users.blocks.closeButton" />
      </Button>
    </ModalFooter>
  );

  const platform = window.navigator.platform;
  const shortcutsData = [];
  allCommands.forEach(key => {
    let value = {};

    if (platform.includes('Mac')) {
      value = {
        'action': key.label,
        'shortcut': upperFirst(key.shortcut.replace('mod', 'cmd').replace('alt', 'Option')),
      };
    } else {
      value = {
        'action': key.label,
        'shortcut': upperFirst(key.shortcut.replace('mod', 'ctrl')),
      };
    }
    shortcutsData.push(value);
  });

  const columnMapping = {
    action: <FormattedMessage id="ui-users.shortcut.action" />,
    shortcut: <FormattedMessage id="ui-users.shortcut.shortcut" />,
  };

  const columnWidths = {
    'action': '50%',
    'shortcut': '50%',
  };

  return (
    <Modal
      autosize
      dismissible
      footer={footer}
      id="keyboard-shortcuts-modal"
      label={<FormattedMessage id="ui-users.appMenu.keyboardShortcuts" />}
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
  allCommands: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default KeyboardShortcutsModal;
