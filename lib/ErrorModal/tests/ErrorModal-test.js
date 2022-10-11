import React from 'react';

import sinon from 'sinon';
import { describe, beforeEach, it } from 'mocha';
import { runAxeTest, Modal, Button, including, converge } from '@folio/stripes-testing';
import { RoledHTML } from '../../../tests/helpers/localInteractors';
import { mountWithContext } from '../../../tests/helpers';
import ErrorModal from '../ErrorModal';

const ErrorModalInteractor = Modal.extend('Error modal')
  .filters({
    errorText: (el) => el.querySelector('[class^="modalContent--"]').textContent
  })
  .actions({
    clickClose: ({ find }, label = 'Close') => find(Button(including(label))).click()
  });

describe('ErrorModal', () => {
  const errorModal = ErrorModalInteractor();
  const onClose = sinon.spy();

  const label = 'Something went wrong';
  const content = 'Here is a detailed message that explains why the error occurred.';
  const buttonLabel = 'Close';

  beforeEach(async () => {
    await mountWithContext(
      <ErrorModal
        open
        label={label}
        content={content}
        onClose={onClose}
      />
    );
  });

  it('has no axe errors. - ErrorModal', runAxeTest);

  it('the label text should be correct', () => errorModal.has({ title: label }));

  it('the content text should be correct', () => errorModal.has({ errorText: content }));

  it('the content tagName should be div', () => RoledHTML({ className: including('modalContent') }).has({ tagName: 'DIV' }));

  it('shows correct button label', () => Button(buttonLabel).exists());

  describe('when clicking the close button', () => {
    beforeEach(async () => {
      await errorModal.clickClose();
    });

    it('the onClose callback should be fired', () => converge(() => onClose.called));
  });
});
