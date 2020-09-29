/**
 * ErrorBoundary -> tests -> interactor
 */

import { interactor, Interactor } from '@bigtest/interactor';
import HeadlineInteractor from '../../Headline/tests/interactor';
import ButtonInteractor from '../../Button/tests/interactor';
import ModalInteractor from '../../Modal/tests/interactor';

export const ErrorMessageInteractor = interactor(class ErrorMessageInteractor {
  static defaultScope = '[data-test-error-boundary-message]';
  error = new HeadlineInteractor('[data-test-error-boundary-message-error]');
  stackTrace = new Interactor('[data-test-error-boundary-message-stack-trace]');
});
export const ProductionErrorInteractor = interactor(class ProductionErrorInteractor {
  static defaultScope = '[data-test-error-boundary-production-error]';
  title = new HeadlineInteractor('[data-test-error-boundary-production-error-title]');
  subTitle = new HeadlineInteractor('[data-test-error-boundary-production-error-sub-title]');
  detailsModal = new ModalInteractor('[data-test-error-boundary-production-error-details-modal]');
  detailsButton = new ButtonInteractor('[data-test-error-boundary-production-error-details-button]');
  copyErrorButton = new ButtonInteractor('[data-test-error-boundary-production-error-copy-button]');
  resetButton = new ButtonInteractor('[data-test-error-boundary-production-error-reset-button]');
  errorMessage = new ErrorMessageInteractor();
});

export default interactor(class ErrorBoundaryInteractor {
  static defaultScope = '[data-test-error-boundary]';
});
