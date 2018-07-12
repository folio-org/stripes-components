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
  height = property('offsetHeight');
  width = property('offsetWidth');

  rendersSmall = hasClass(css.small);
  rendersMedium = hasClass(css.medium);
  rendersLarge = hasClass(css.large);
  rendersError = hasClass(css.error);
  rendersWarn = hasClass(css.warn);
  rendersSuccess = hasClass(css.success);
  rendersFlip = hasClass(css.icon.flippable);
  rendersTitle = attribute('title');

  /**
   * return true iff the given class is present on the top-level element
   */
  rendersClass(className) {
    return this.$root.classList.contains(className);
  }

  /**
   * return true iff the given class is present on the first-child element
   */
  rendersSvgClass(className) {
    return this.$root.firstElementChild.classList.contains(className);
  }
});
