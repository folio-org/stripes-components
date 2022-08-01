/**
 * KeyboardShortcutsModal tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import { converge, Modal } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';

import KeyboardShortcutsModal from '../KeyboardShortcutsModal';
import coreShortcuts from '../coreShortcuts';

const KeyboardShortcutsModalInteractor = Modal.extend('keyboard shortcuts modal')
  .selector('[data-test-keyboard-shortcuts-modal]')
  .filters({
    shortcutCount: (el) => el.querySelectorAll('div[data-row-index]').length
  });

describe('KeyboardShortcutsModal', () => {
  const kSM = KeyboardShortcutsModalInteractor();
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
  const onClose = sinon.spy();

  beforeEach(async () => {
    await mountWithContext(
      <KeyboardShortcutsModal
        onClose={onClose}
        allCommands={commands}
      />
    );
  });

  it('Should render KeyboardShortcutsModal', () => kSM.exists());


  it('Should render the correct count of shortcuts', () => kSM.has({ shortcutCount: commands.length + coreShortcuts.length }));

  describe('When clicking the close button', () => {
    beforeEach(async () => {
      await kSM.dismiss();
    });
    it('Should call the onClose handler', () => converge(() => onClose.called));
  });
});
