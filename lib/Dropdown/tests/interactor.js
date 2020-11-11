/**
 * Dropdown interactor
 */

import {
  interactor,
  is,
  isPresent,
  clickable,
  focusable,
  collection,
  triggerable,
  attribute,
  blurrable,
} from '@bigtest/interactor';
import { isVisible } from 'element-is-visible';

@interactor class DropdownMenuItemInteractor {
  isFocused = is(':focus');
  blur = blurrable();
  pressDownKey = triggerable('keydown', { keyCode: 40 });
  pressUpKey = triggerable('keydown', { keyCode: 38 });
  pressEscape = triggerable('keydown', { keyCode: 27 });
  pressHomeKey = triggerable('keydown', { keyCode: 36 });
  pressEndKey = triggerable('keydown', { keyCode: 35 });
}

@interactor class DropdownMenuInteractor {
  items = collection('button, input:not([data-focus-exclude]), a, [role="menuitem"]', DropdownMenuItemInteractor);
  focusStartProxy = focusable('[data-reverse-proxy]');
  focusEndProxy = focusable('[data-forward-proxy]');
  isFocused = is(':focus');
  get isVisible() {
    return isVisible(this.$root);
  }
}

export default @interactor class DropdownInteractor {
  triggerDisplayed = isPresent('[aria-haspopup]');
  triggerFocused = is('[aria-haspopup]', ':focus');
  clickTrigger = clickable('[aria-haspopup]');
  focusTrigger = focusable('[aria-haspopup]');
  pressDownKey = triggerable('[aria-haspopup]', 'keydown', { keyCode: 40 });
  pressUpKey = triggerable('[aria-haspopup]', 'keydown', { keyCode: 38 });
  menu = new DropdownMenuInteractor('[data-test-dropdown-menu-overlay]');
  ariaExpandedAttribute = attribute('[aria-haspopup]', 'aria-expanded');
  get isOpen() {
    return isVisible(this.$('[data-test-dropdown-menu-overlay]'));
  }

  focusAndOpen() {
    return this
      .focusTrigger()
      .pressDownKey();
  }
}

export { DropdownMenuInteractor };
