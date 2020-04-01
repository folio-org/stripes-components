/**
 * NavListItem interactor
 */

import {
  interactor,
  hasClass,
  computed,
} from '@bigtest/interactor';
import css from '../NavListItem.css';

const tagName = (selector) => computed(function () {
  return this.$(selector).tagName.toLowerCase();
});

export default interactor(class NavListInteractor {
  static defaultScope = '[data-test-nav-list-item]';
  isActive = hasClass(css.isActive);
  isDisabled = hasClass(css.isDisabled);
  tagName = tagName();
});
