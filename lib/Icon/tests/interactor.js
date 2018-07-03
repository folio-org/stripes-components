/**
 * Icon interactor
 */

import { interactor } from '@bigtest/interactor';
import { selectorFromClassnameString } from '../../../tests/helpers';
import css from '../Icon.css';

const iconClassSelector = selectorFromClassnameString(css.icon);

export default interactor(class IconInteractor {
  static defaultScope = iconClassSelector;
});
