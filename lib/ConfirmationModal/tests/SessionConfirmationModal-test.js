/**
 * ConfirmationModal test
 */

import React from 'react';

import { after, describe, beforeEach, it } from 'mocha';
import { runAxeTest, converge, Bigtest, ConfirmationModal as ConfirmationModalInteractor, Keyboard, Button, Checkbox } from '@folio/stripes-testing';
import { mountWithContext } from '../../../tests/helpers';

import SessionConfirmationModal from '../SessionConfirmationModal';

const html = Bigtest.HTML;
const ConfirmButton = Button.extend('confirm button')
  .filters({
    focused: el => document.activeElement === el,
    disabled: el => el.disabled,
  });

describe('SessionConfirmationModal', () => {
  const confirmationModal = ConfirmationModalInteractor();
  let confirmed;
  let cancelled;

  const sessionKey = 'test-session-key';
  const message = 'Something will happen if you do this.';
  const heading = 'Are you sure?';
  const cancelLabel = 'Cancel this action';
  const confirmLabel = 'Confirm this action';

  beforeEach(async () => {
    confirmed = false;
    cancelled = false;

    await mountWithContext(
      <SessionConfirmationModal
        open
        id="confirmation-modal-test"
        heading={heading}
        message={message}
        bodyTag="div"
        onConfirm={() => { confirmed = true; }}
        onCancel={() => { cancelled = true; }}
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        sessionKey={sessionKey}
      />
    );
  });

  it('has no axe errors. - ConfirmationModal', runAxeTest);

  it('focus is on the primary button', () => ConfirmButton(confirmLabel).is({ focused: true }));

  it('displays the suppress checkbox', () => {
    Checkbox('Do not display this message again.').exists();
  });

  describe('when confirm button is disabled', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SessionConfirmationModal
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
          sessionKey={sessionKey}
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

  describe('Checking the suppression checkbox', () => {
    beforeEach(async () => {
      await Checkbox('Do not display this message again.').click();
      await confirmationModal.confirm();
    });

    it('should set the session key and call the confirm callback', () =>
      Promise.all([
        converge(() => {
          if (!sessionStorage.getItem(sessionKey)) { throw Error('Session key should be set'); }
        }),
        converge(() => { if (!confirmed) { throw Error('The onConfirm callback should be fired'); } }),
      ])
    );
  });

  describe('and reopening the modal', () => {
    beforeEach(async () => {
      await mountWithContext(
        <SessionConfirmationModal
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
          sessionKey={sessionKey}
        />
      );
    });

    after(() => {
      sessionStorage.removeItem(sessionKey);
    });

    it('the modal should not be displayed', () => confirmationModal.absent());
  });
});
