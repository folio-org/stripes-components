import {
  attribute,
  clickable,
  focusable,
  interactor,
  is,
  triggerable,
} from '@bigtest/interactor';

export default interactor(class IconButtonInteractor {
  static defaultScope = '[class*=iconButton---]';
  id = attribute('id');
  href = attribute('href');
  className = attribute('class');
  ariaLabel = attribute('aria-label');
  isAnchor = is('a');
  isButton = is('button');
  clickIconButton = clickable();
  focus = focusable();
  isFocused = is(':focus');
  pressEscape = triggerable('keydown', { keyCode: 27, key: 'Escape' });
});
