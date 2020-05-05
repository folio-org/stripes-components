/**
 * ModalFooter interactor
 */

import { interactor, scoped } from '@bigtest/interactor';
import ButtonInteractor from '../../Button/tests/interactor';

export default interactor(class ModalFooterInteractor {
  primaryButton = scoped('#modalFooterPrimaryButton', ButtonInteractor);
  secondaryButton = scoped('#modalFooterSecondaryButton', ButtonInteractor);
});
