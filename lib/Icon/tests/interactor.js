/**
 * Icon interactor
 */

import { interactor, attribute, scoped, property, hasClass, isPresent, text } from '@bigtest/interactor';
import { selectorFromClassnameString } from '../../../tests/helpers';
import css from '../Icon.css';

const iconClassSelector = selectorFromClassnameString(`.${css.icon}`);

export default interactor(class IconInteractor {
  static defaultScope = iconClassSelector;

  id = attribute('id');
  className = attribute('class');
  ariaLabel = attribute('aria-label');
  label = text();

  isSmall = hasClass(`.${css.icon} svg`, css.small);
  isMedium = hasClass(`.${css.icon} svg`, css.medium);
  isLarge = hasClass(`.${css.icon} svg`, css.large);

  isError = hasClass(css.error);
  isWarn = hasClass(css.warn);
  isSuccess = hasClass(css.success);

  isFlippable = hasClass(css.icon.flippable);
  isSvg = isPresent(`.${css.icon} svg`);

  width = property('offsetWidth');
  height = property('offsetHeight');

  svg = scoped('svg', {
    className: attribute('class'),
  });
});
