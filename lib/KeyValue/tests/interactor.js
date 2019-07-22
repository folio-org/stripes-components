import {
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

import { selectorFromClassnameString } from '../../../tests/helpers';

import css from '../KeyValue.css';

const iconClassSelector = selectorFromClassnameString(`.${css.kvRoot}`);

export default interactor(class KeyValueInteractor {
  static defaultScope = iconClassSelector;

  hasLabel = isPresent('[class^="kvLabel"]');
  label = text('[class^="kvLabel"]');
  hasValue = isPresent('div:nth-child(2)');
  value = text('div:nth-child(2)');
});
