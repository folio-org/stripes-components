/**
 * Layout interactor
 */

import {
  interactor,
  attribute,
  property,
} from '@bigtest/interactor';

export default interactor(class ModalInteractor {
  static defaultScope = '[data-test-layout]';
  className = attribute('class');
  element = property('tagName');
});
