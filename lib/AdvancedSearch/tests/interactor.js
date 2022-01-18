/**
 * AdvancedSearch interactor
 */

import {
  interactor,
  scoped,
  selectable,
  fillable,
  collection,
} from '@bigtest/interactor';
import ButtonInteractor from '../../Button/tests/interactor';

class AdvancedSearchRowInteractor {
  booleanSelect = selectable('[data-test-advanced-search-bool]');
  queryInput = fillable('[data-test-advanced-search-query]');
  optionSelect = selectable('[data-test-advanced-search-option]');
}

export default interactor(class AdvancedSearchInteractor {
  searchButton = scoped('[data-test-advanced-search-button-search]', ButtonInteractor);
  cancelButton = scoped('[data-test-advanced-search-button-cancel]', ButtonInteractor);
  searchRows = collection('[data-test-advanced-search-row', AdvancedSearchRowInteractor);
});
