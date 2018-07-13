import {
  interactor,
  isPresent,
  attribute,
  hasClass,
  property,
} from '@bigtest/interactor';

import css from '../Icon.css';
import { selectorFromClassnameString } from '../../../tests/helpers';

// necessary due to composing classnames with postcss `composes`
const iconClassSelector = selectorFromClassnameString(`.${css.icon}`);

export default interactor(class IconInteractor {
  static defaultScope = iconClassSelector;

  id = attribute('id');
  title = property('title');
  isSvg = isPresent(`.${css.icon} svg`);
  isSmall = hasClass(css.small);
  isMedium = hasClass(css.medium);
  isLarge = hasClass(css.large);
  isError = hasClass(css.error);
  isWarn = hasClass(css.warn);
  isSuccess = hasClass(css.success);
  isFlippable = hasClass(css.icon.flippable);
  rendersTitle = attribute('title');

  /**
   * return true iff the given class is present on the top-level element
   */
  hasClass(className) {
    return this.$root.classList.contains(className);
  }

  /**
   * return true iff the given class is present on the first-child element
   */
  hasSvgClass(className) {
    return this.$root.firstElementChild.classList.contains(className);
  }
});
