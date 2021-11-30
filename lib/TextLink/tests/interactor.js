/**
 * Link -> interactor
 */

import {
  attribute,
  interactor,
  computed,
} from '@bigtest/interactor';

function tagName(selector) {
  return computed(function () {
    return this.$(selector).tagName.toLowerCase();
  });
}

export default interactor(class LinkInteractor {
  static defaultScope = '[data-test-text-link]';

  href = attribute('href');
  id = attribute('id');
  tagName = tagName();
});
