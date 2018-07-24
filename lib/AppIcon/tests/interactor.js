/**
 * AppIcon interactor
 */

import { interactor } from '@bigtest/interactor';
import { selectorFromClassnameString } from '../../../tests/helpers';
import css from '../AppIcon.css';

const appIconClassSelector = selectorFromClassnameString(css.appIcon);

@interactor class AppIconInteractor {
  static defaultScope = appIconClassSelector;
}

export default AppIconInteractor;
