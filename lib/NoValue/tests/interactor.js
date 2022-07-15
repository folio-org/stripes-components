import {
  text,
  interactor,
} from '@bigtest/interactor';

export default interactor(class NoValueInteractor {
  static defaultScope = '[data-test-no-value]';

  ariaLabel = text('[class=sr-only]');
});
