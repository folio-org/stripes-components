import {
  interactor,
  is,
  attribute,
  clickable,
  hasClass,
  text,
} from '@bigtest/interaction';

import css from '../Button.css';

export default interactor(class ButtonInteractor {
  id = attribute(`.${css.button}`, 'id');
  label = text(`.${css.button}`);
  isAnchor = is('a', `.${css.button}`);
  isButton = is('button', `.${css.button}`);
  rendersDefault = hasClass(`.${css.button}`, css.default);
  rendersPrimary = hasClass(`.${css.button}`, css.primary);
  rendersBottomMargin0 = hasClass(`.${css.button}`, css.marginBottom0)
  clickButton = clickable(`.${css.button}`);
  windowHash = window.location.hash;
});
