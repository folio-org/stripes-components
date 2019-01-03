/**
 * NavList interactor
 */

import {
  interactor,
  attribute,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class NavListInteractor {
  static defaultScope = '[data-test-nav-list]';
  class = attribute('class')
  id = attribute('id')
  hasChildren = isPresent('*');
});
