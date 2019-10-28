import {
  attribute,
  clickable,
  focusable,
  interactor,
  is,
} from '@bigtest/interactor';

import css from '../IconButton.css';
import { selectorFromClassnameString } from '../../../tests/helpers';

const baseClass = selectorFromClassnameString(`.${css.iconButton}`);
export default interactor(class IconButtonInteractor {
  static defaultScope = baseClass;
  id = attribute('id');
  href = attribute('href');
  className = attribute('class');
  ariaLabel = attribute('aria-label');
  isAnchor = is('a');
  isButton = is('button');
  clickIconButton = clickable();
  focus = focusable();
});
