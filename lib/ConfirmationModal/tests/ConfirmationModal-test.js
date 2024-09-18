/**
 * ConfirmationModal test
 */

import React from 'react';

import { describe, beforeEach, it } from 'mocha';
import { runAxeTest, converge, Bigtest, ConfirmationModal as ConfirmationModalInteractor, Keyboard, Button } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';

import ConfirmationModal from '../ConfirmationModal';

const html = Bigtest.HTML;
const ConfirmButton = Button.extend('confirm button')
  .filters({
    focused: el => document.activeElement === el,
    disabled: el => el.disabled,
  });

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

  it('focus is on the primary button', () => ConfirmButton(confirmLabel).is({ focused: true }));

  describe('when confirm button is disabled', () => {
    beforeEach(async () => {
      await mountWithContext(
        <ConfirmationModal
          open
          id="confirmation-modal-test"
          heading={heading}
          message={message}
          bodyTag="div"
          isConfirmButtonDisabled
          onConfirm={() => { confirmed = true; }}
          onCancel={() => { cancelled = true; }}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
        />
      );
    });

    it('The confirm button should have disabled attribute', () => ConfirmButton(confirmLabel).has({ disabled: true }));
  });

  describe('When clicking the confirm button', () => {
    beforeEach(async () => {
      confirmed = false;
      cancelled = false;
      await confirmationModal.confirm();
    });

    it('The onConfirm callback should be fired', () => converge(() => { if (!confirmed) { throw Error('The onConfirm callback should be fired'); } }));
  });

  describe('When clicking the cancel button', () => {
    beforeEach(async () => {
      await confirmationModal.cancel();
    });

    it('The onCancel callback should be fired', () => {
      converge(() => cancelled);
    });
  });

  describe('When pressing the escape key', () => {
    beforeEach(async () => {
      await Keyboard.escape();
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
