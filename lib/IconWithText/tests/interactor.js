/**
 * IconWithText interactor
 */

import { interactor, scoped } from '@bigtest/interactor';
import { selectorFromClassnameString } from '../../../tests/helpers';

import IconInteractor from '../../Icon/tests/interactor';
import AppIconInteractor from '../../AppIcon/tests/interactor';
import css from '../IconWithText.css';

const iconWithTextClassSelector = selectorFromClassnameString(`.${css.iconWithText}`);

export default interactor(class IconWithTextInteractor {
  static defaultScope = iconWithTextClassSelector;
  regularIcon = scoped(`.${css.regularIcon}`, IconInteractor);
  appIcon = scoped(`.${css.appIcon}`, AppIconInteractor);
});
