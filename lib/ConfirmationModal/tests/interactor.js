/**
 * ConfirmationModal interactor
 */

import { interactor, scoped } from '@bigtest/interactor';
import ButtonInteractor from '../../Button/tests/interactor';

export default interactor(class ModalFooterInteractor {
  confirmButton = scoped('[data-test-confirmation-modal-confirm-button]', ButtonInteractor);
  cancelButton = scoped('[data-test-confirmation-modal-cancel-button]', ButtonInteractor);
});
