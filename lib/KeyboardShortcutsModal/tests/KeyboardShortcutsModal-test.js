/**
 * KeyboardShortcutsModal tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { mountWithContext } from '../../../tests/helpers';

import KeyboardShortcutsModal from '../KeyboardShortcutsModal';
import KeyboardShortcutsModalInteractor from './interactor';

describe('KeyboardShortcutsModal', () => {
  const keyboardShortcutsModal = new KeyboardShortcutsModalInteractor();
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

  it('Should render KeyboardShortcutsModal', () => {
    expect(keyboardShortcutsModal.isPresent).to.be.true;
  });

  it('Should render close button', () => {
    expect(keyboardShortcutsModal.closeButton.isPresent).to.be.true;
  });

  it('Should render the correct count of shortcuts', () => {
    expect(keyboardShortcutsModal.shortcutCount).to.equal(commands.length);
  });

  describe('When clicking the close button', () => {
    beforeEach(async () => {
      await keyboardShortcutsModal.closeButton.click();
    });
    it('Should call the onClose handler', () => {
      expect(onClose.called).to.be.true;
    });
  });
});
