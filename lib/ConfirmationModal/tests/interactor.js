/**
 * ConfirmationModal interactor
 */

import { interactor, scoped } from '@bigtest/interactor';
import ButtonInteractor from '../../Button/tests/interactor';

export default interactor(class ModalFooterInteractor {
  confirmButton = scoped('#clickable-confirmation-modal-test-confirm', ButtonInteractor);
  cancelButton = scoped('#clickable-confirmation-modal-test-cancel', ButtonInteractor);
});
