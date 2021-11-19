import {
  attribute,
  interactor,
  scoped,
} from '@bigtest/interactor';

export default interactor(class KeyValueInteractor {
  static defaultScope = '[class*=kvRoot---]';

  label = scoped('[class*=kvLabel---]');
  value = scoped('[data-test-kv-value]');
  sub = scoped('[data-test-kv-sub-value]');

  dataTestFoo = attribute('data-test-foo');
});
