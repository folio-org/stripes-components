import {
  attribute,
  interactor,
} from '@bigtest/interactor';

export default interactor(class NoValueInteractor {
  static defaultScope = '[data-test-no-value]';

  roleAttribute = attribute('role');
  ariaLabelAttribute = attribute('aria-label');
});
