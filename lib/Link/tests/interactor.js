/**
 * Link -> interactor
 */

import {
  attribute,
  interactor,
  scoped,
} from '@bigtest/interactor';

export default interactor(class LinkInteractor {
  static defaultScope = '[data-test-link]';
});
