import {
  attribute,
  interactor,
  scoped,
} from '@bigtest/interactor';

import { selectorFromClassnameString } from '../../../tests/helpers';

import css from '../KeyValue.css';

const iconClassSelector = selectorFromClassnameString('[class*=kvRoot---]');

export default interactor(class KeyValueInteractor {
  static defaultScope = iconClassSelector;

  label = scoped('[class*=kvLabel---]');
  value = scoped('[data-test-kv-value]');
  sub = scoped('[data-test-kv-sub-value]');

  dataTestFoo = attribute('data-test-foo');
});
