/**
 * ExportCSV interactor
 */

import { interactor, isPresent } from '@bigtest/interactor';

// uncomment once we have a good way to test downloads.
// function linkPresent() {
//   return computed(() => {
//     return !!document.querySelector('[data-test-exportcsv-link]');
//   });
// }

export default interactor(class ExportCsvInteractor {
  isDisplayed = isPresent('button');
  // click = clickable('button');
  // linkMade = linkPresent();
});
