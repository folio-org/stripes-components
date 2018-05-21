import {
  interactor,
  is,
  attribute,
  clickable,
  hasClass,
  text,
} from '@bigtest/interactor';

import css from '../Button.css';
import { selectorFromClassnameString } from '../../../tests/helpers';

const btnClass = selectorFromClassnameString(`.${css.button}`);

export default interactor(class ButtonInteractor {
  id = attribute(btnClass, 'id');
  href = attribute(btnClass, 'href');
  label = text(btnClass);
  isAnchor = is('a', btnClass);
  isButton = is('button', btnClass);
  rendersDefault = hasClass(btnClass, css.default);
  rendersPrimary = hasClass(btnClass, css.primary);
  rendersBottomMargin0 = hasClass(btnClass, css.marginBottom0)
  clickButton = clickable(btnClass);
});
