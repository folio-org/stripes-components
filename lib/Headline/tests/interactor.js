/**
 * Headline interactor
 */

import { interactor, text, hasClass, computed, attribute } from '@bigtest/interactor';
import css from '../Headline.css';

export const sizes = ['small', 'medium', 'large', 'x-large', 'xx-large'];

const tagName = (selector) => computed(function () {
  return this.$(selector).tagName.toLowerCase();
});

export default interactor(class HeadlineInteractor {
  static defaultScope = '[data-test-headline]';

  constructor() {
    sizes.forEach(size => {
      this[`has-size-${size}`] = hasClass(css[`size-${size}`]);
      this[`has-margin-${size}`] = hasClass(css[`margin-${size}`]);
    });
  }

  label = text();
  class = attribute('class');
  tagName = tagName();

  isFaded = hasClass(css.isFaded);
  isFlex = hasClass(css.flex);
  isBlock = hasClass(css.block);

  hasRegularFontWeight = hasClass(css['font-weight-regular']);
  hasMediumFontWeight = hasClass(css['font-weight-medium']);
  hasBoldFontWeight = hasClass(css['font-weight-bold']);
  hasBlackFontWeight = hasClass(css['font-weight-black']);
});
