/**
 * NavListSection interactor
 */

import {
  interactor,
  attribute,
  isPresent,
  scoped
} from '@bigtest/interactor';

export default interactor(class NavListInteractor {
  static defaultScope = '[data-test-nav-list-section]';
  class = attribute('class')
  id = attribute('id')
  hasChildren = isPresent('*');
  header = scoped('[data-test-nav-list-section-header]');
});
