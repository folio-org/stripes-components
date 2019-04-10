import {
  interactor,
  clickable,
  collection,
  scoped,
  fillable,
  text,
  isPresent,
  isVisible
} from '@bigtest/interactor';

import css from '../AutoSuggest.css';
import { selectorFromClassnameString } from '../../../tests/helpers';
import TextFieldInteractor from '../../TextField/tests/interactor';

@interactor class listItemInteractor {
  text = text();
  click = clickable();
}

@interactor class AutoSuggestListInteractor {
  defaultScope = 'data-test-autosuggest-list';
  isOpen = isVisible();
  items = collection('li', listItemInteractor);
}

@interactor class AutoSuggestInteractor {
  defaultScope = 'data-test-autosuggest';
  labelDisplayed = isPresent('label');
  renders = isPresent('input');
  input = scoped(`.${css.textFieldDiv}`, TextFieldInteractor);
  list = new AutoSuggestListInteractor(`.${css.autoSuggest}`);
}

export default AutoSuggestInteractor;
