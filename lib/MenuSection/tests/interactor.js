/**
 * MenuSection interactor
 */

import { interactor, isPresent, attribute, property } from '@bigtest/interactor';
import { selectorFromClassnameString } from '../../../tests/helpers';

const iconClassSelector = selectorFromClassnameString('[data-test-memu-section]');

export default interactor(class MenuSectionInteractor {
  static defaultScope = iconClassSelector;
  hasLabel = isPresent('[data-test-menu-section-label]');
  hasContent = isPresent('*:last-child:not([data-test-menu-section-label])')
  labelTag = property('[data-test-menu-section-label]', 'localName');
  className = attribute('class');
  id = attribute('id');
});
