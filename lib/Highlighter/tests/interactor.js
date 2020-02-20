/**
 * Highlighter -> interactor
 */

import {
  attribute,
  interactor,
  scoped,
} from '@bigtest/interactor';

import { selectorFromClassnameString } from '../../../tests/helpers';

import css from '../Highlighter';

const iconClassSelector = selectorFromClassnameString(`.${css.kvRoot}`);

export default interactor(class HighlighterInteractor {
  static defaultScope = iconClassSelector;
});
