/**
 * ErrorBoundary -> tests -> interactor
 */

import {
  interactor,
  attribute,
  isPresent,
} from '@bigtest/interactor';
import HeadlineInteractor from '../../Headline/tests/interactor';
import ModalInteractor from '../../Modal/tests/interactor';

export default interactor(class ErrorBoundaryInteractor {
  static defaultScope = '[data-test-error-boundary]';
  title = new HeadlineInteractor('[data-test-error-boundary-title]');
  subTitle = new HeadlineInteractor('[data-test-error-boundary-subTitle]');
  detailsModal = new ModalInteractor('#error-boundary-details-modal');
});
