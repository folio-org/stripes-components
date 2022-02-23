/**
 * ConfirmationModal interactor
 */

import {
  interactor,
  scoped,
  computed,
  Interactor,
} from '@bigtest/interactor';
import ButtonInteractor from '../../Button/tests/interactor';

const tagName = selector => computed(function () {
  return this.$(selector).tagName.toLowerCase();
});

export default interactor(class ConfirmationModalInteractor {
  heading = new Interactor('[class*=modalLabel---]');
  body = new Interactor('[data-test-confirmation-modal-message]');
  bodyTagName = tagName('[data-test-confirmation-modal-message]');
  confirmButton = scoped('[data-test-confirmation-modal-confirm-button]', ButtonInteractor);
  cancelButton = scoped('[data-test-confirmation-modal-cancel-button]', ButtonInteractor);
});
