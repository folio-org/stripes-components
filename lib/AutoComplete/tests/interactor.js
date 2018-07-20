import {
  interactor,
  attribute,
  count,
} from '@bigtest/interactor';

import css from '../AutoComplete.css';
import { selectorFromClassnameString } from '../../../tests/helpers';

const AutoCompleteClassSelector = selectorFromClassnameString(`.${css.AutoComplete}`);

export default interactor(class AutoCompleteInteractor {
  static defaultScope = AutoCompleteClassSelector;
  id = attribute('id');
  optionCount = count('li');
});
