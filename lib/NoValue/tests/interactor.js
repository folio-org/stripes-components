import {
  attribute,
  interactor,
} from '@bigtest/interactor';

export default interactor(class NoValueInteractor {
  static defaultScope = '[data-test-no-value]';

  ariaLabelAttribute = attribute('aria-label');
});
