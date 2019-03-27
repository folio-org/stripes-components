/**
 * ExportCSV interactor
 */

import { interactor, isPresent, clickable, computed } from '@bigtest/interactor';

function linkPresent() {
  return computed(() => {
    return !!document.querySelector('[data-test-exportcsv-link]');
  });
}

export default interactor(class ExportCsvInteractor {
  isDisplayed = isPresent('button');
  click = clickable('button');
  linkMade = linkPresent();
});
