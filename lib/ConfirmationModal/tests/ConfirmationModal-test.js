/**
 * ConfirmationModal test
 */

import React from 'react';

import { describe, beforeEach, it } from 'mocha';
import { runAxeTest, converge, Bigtest, ConfirmationModal as ConfirmationModalInteractor } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';

import ConfirmationModal from '../ConfirmationModal';

const html = Bigtest.HTML;

describe('ConfirmationModal', () => {
  const confirmationModal = ConfirmationModalInteractor();
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

  it('has no axe errors. - ConfirmationModal', runAxeTest);

  describe('When clicking the confirm button', () => {
    beforeEach(async () => {
      await confirmationModal.confirm();
    });

    it('The onConfirm callback should be fired', () => {
      converge(() => confirmed);
    });
  });

  describe('When clicking the cancel button', () => {
    beforeEach(async () => {
      await confirmationModal.cancel();
    });

    it('The onCancel callback should be fired', () => {
      converge(() => cancelled);
    });
  });

  describe('Modal body tagName', () => {
    it('sets correct HTML tag', () => {
      html('[data-test-confirmation-modal-message]').has({ tagName: 'div' });
    });
  });
});
