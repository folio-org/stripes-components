/**
 * ConfirmationModal test
 */

import React from 'react';

import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import { mountWithContext } from '../../../tests/helpers';

import ConfirmationModal from '../ConfirmationModal';
import ConfirmationModalInteractor from './interactor';

describe('ConfirmationModal', () => {
  const confirmationModal = new ConfirmationModalInteractor();
  let confirmed;
  let cancelled;

  const message = 'Something will happen if you do this.';
  const heading = 'Are you sure?';
  const cancelLabel = 'Cancel this action';
  const confirmLabel = 'Confirm this action';

  beforeEach(async () => {
    confirmed = false;
    cancelled = false;

    await mountWithContext(
      <ConfirmationModal
        open
        id="confirmation-modal-test"
        heading={heading}
        message={message}
        bodyTag="div"
        onConfirm={() => { confirmed = true; }}
        onCancel={() => { cancelled = true; }}
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
      />
    );
  });

  describe('When clicking the confirm button', () => {
    beforeEach(async () => {
      await confirmationModal.confirmButton.click();
    });

    it('The onConfirm callback should be fired', () => {
      expect(confirmed).to.be.true;
    });
  });

  describe('When clicking the cancel button', () => {
    beforeEach(async () => {
      await confirmationModal.cancelButton.click();
    });

    it('The onCancel callback should be fired', () => {
      expect(cancelled).to.be.true;
    });
  });

  describe('Modal body tagName', () => {
    it('sets correct HTML tag', () => {
      expect(confirmationModal.bodyTagName).to.equal('div');
    });
  });
});
