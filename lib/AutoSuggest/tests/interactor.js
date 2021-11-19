import {
  interactor,
  clickable,
  collection,
  scoped,
  text,
  isPresent,
  isVisible
} from '@bigtest/interactor';

import css from '../AutoSuggest.css';
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
  input = scoped('[class*=textFieldDiv---]', TextFieldInteractor);
  list = new AutoSuggestListInteractor('[class*=autoSuggest---]');
}

export default AutoSuggestInteractor;
