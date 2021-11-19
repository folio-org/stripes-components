/**
 * MenuSection interactor
 */

import { interactor, isPresent, attribute, property } from '@bigtest/interactor';

export default interactor(class MenuSectionInteractor {
  static defaultScope = '[data-test-menu-section]';
  hasLabel = isPresent('[data-test-menu-section-label]');
  hasContent = isPresent('*:last-child:not([data-test-menu-section-label])')
  labelTag = property('[data-test-menu-section-label]', 'localName');
  className = attribute('class');
  id = attribute('id');
});
