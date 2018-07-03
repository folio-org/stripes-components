/**
 * Icon interactor
 */

import { interactor, attribute, scoped, property } from '@bigtest/interactor';
import { selectorFromClassnameString } from '../../../tests/helpers';
import css from '../Icon.css';

const iconClassSelector = selectorFromClassnameString(`.${css.icon}`);

export default interactor(class IconInteractor {
  static defaultScope = iconClassSelector;
  width = property('offsetWidth');
  height = property('offsetHeight');
  className = attribute('class');
  svg = scoped('svg', {
    className: attribute('class'),
  });
});
