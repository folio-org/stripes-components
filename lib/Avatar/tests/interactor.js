/**
 * Avatar interactor
 */

import {
  interactor,
  attribute,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class AvatarInteractor {
  static defaultScope = '[data-test-avatar]';
  class = attribute('class')
  hasImage = isPresent('img')
  hasPlaceholder = isPresent('svg')
});
