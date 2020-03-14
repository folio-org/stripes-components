/**
 * ConfirmationModal interactor
 */

import { interactor, scoped, computed } from '@bigtest/interactor';
import ButtonInteractor from '../../Button/tests/interactor';

const tagName = selector => computed(function () {
  return this.$(selector).tagName.toLowerCase();
});

export default interactor(class ModalFooterInteractor {
  confirmButton = scoped('[data-test-confirmation-modal-confirm-button]', ButtonInteractor);
  cancelButton = scoped('[data-test-confirmation-modal-cancel-button]', ButtonInteractor);
  bodyTagName = tagName('[data-test-confirmation-modal-message]');
});
