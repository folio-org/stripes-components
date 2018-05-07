import {
  interactor,
  attribute,
  clickable,
  is,
} from '@bigtest/interactor';

import css from '../IconButton.css';
import { selectorFromClassnameString } from '../../../tests/helpers';

const baseClass = selectorFromClassnameString(`.${css.iconButton}`);
export default interactor(class IconButtonInteractor {
  id = attribute(baseClass, 'id');
  href = attribute(baseClass, 'href');
  isAnchor = is('a', baseClass);
  isButton = is('button', baseClass);
  clickIconButton = clickable(baseClass);
});
