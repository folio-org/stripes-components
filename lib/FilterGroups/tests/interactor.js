import {
  interactor,
  isVisible,
  isPresent,
  collection,
  text,
  clickable,
} from '@bigtest/interactor';

import CheckboxInteractor from '../../Checkbox/tests/interactor';

export default interactor(class FilterGroupInteractor {
  defaultScope = 'data-test-filter-group';
  hasControlGroup = isPresent('[data-test-filter-control-group]');
  checkbox = new CheckboxInteractor('[data-test-filter-control-group]');
  hasFilterCheckbox = isPresent('[data-test-filter-checkbox]');
  checkboxes = collection('[data-test-checkbox]', CheckboxInteractor);
  isFilterGroupVisible = isVisible('[data-test-accordion-wrapper]');
  hasClearButton = isPresent('[data-test-clear-button]');
  clickClearButton = clickable('[data-test-clear-button]');
  hasFilterAccordion = isPresent('[data-test-accordion-section]');
  filterHeading = text('[data-test-headline]');
  isCheckboxSpanWrapperChecked = isPresent('span[class^=labelFocused--]');
});
