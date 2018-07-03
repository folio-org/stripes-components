/**
 * AppIcon interactor
 */

import { interactor } from '@bigtest/interactor';
import { selectorFromClassnameString } from '../../../tests/helpers';
import css from '../AppIcon.css';

const appIconClassSelector = selectorFromClassnameString(css.appIcon);

export default interactor(class AppIconInteractor {
  static defaultScope = appIconClassSelector;
});
