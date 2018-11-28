/**
 * Avatar interactor
 */

import {
  interactor,
  attribute,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class ButtonInteractor {
  static defaultScope = '[data-test-avatar]';
  class = attribute('class')
  hasImage = isPresent('img')
  hasPlaceholder = isPresent('svg')
});
