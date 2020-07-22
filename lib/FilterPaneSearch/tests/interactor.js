import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class FilterPaneSearchInteractor {
  hasSearchBox = isPresent('[data-test-search-box]');
  hasClearButton = isPresent('[data-test-clear-search]');
  hasSearchFieldSelector = isPresent('[data-test-search-field-selector]');
  hasResultsLink = isPresent('[data-test-results-link]');
});
