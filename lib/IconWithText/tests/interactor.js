/**
 * IconWithText interactor
 */

import { interactor } from '@bigtest/interactor';
import { selectorFromClassnameString } from '../../../tests/helpers';
import css from '../IconWithText.css';

const iconWithTextClassSelector = selectorFromClassnameString(`.${css.iconWithText}`);

export default interactor(class IconWithTextInteractor {
  static defaultScope = iconWithTextClassSelector;
  // icon = scoped(`.${css.icon}`)
});
