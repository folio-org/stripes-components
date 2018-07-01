import {
  interactor,
  is,
  attribute,
  hasClass,
  text,
} from '@bigtest/interactor';

import css from '../Button.css';
import { selectorFromClassnameString } from '../../../tests/helpers';

// necessary due to composing classnames with postcss `composes`
const btnClassSelector = selectorFromClassnameString(`.${css.button}`);

export default interactor(class ButtonInteractor {
  static defaultScope = btnClassSelector;
  label = text();
  id = attribute('id');
  href = attribute('href');
  isAnchor = is('a');
  isButton = is('button');
  rendersDefault = hasClass(css.default);
  rendersPrimary = hasClass(css.primary);
  rendersBottomMargin0 = hasClass(css.marginBottom0)
});
