/**
 * Dropdown interactor
 */

import {
  interactor,
  is,
  isPresent,
  clickable,
  attribute,
  focusable,
  collection,
  triggerable,
} from '@bigtest/interactor';

@interactor class DropdownMenuItemInteractor {
  isFocused = is(':focus');
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
}

export default @interactor class DropdownInteractor {
  triggerDisplayed = isPresent('[aria-haspopup]');
  triggerFocused = is('[aria-haspopup]', ':focus');
  clickTrigger = clickable('[aria-haspopup]');
  isOpen = attribute('[aria-haspopup]', 'aria-expanded');
  focusTrigger = focusable('[aria-haspopup]');
  pressDownKey = triggerable('[aria-haspopup]', 'keydown', { keyCode: 40 });
  pressUpKey = triggerable('[aria-haspopup]', 'keydown', { keyCode: 38 });
  menu = new DropdownMenuInteractor('[data-test-dropdown-menu-overlay]');

  focusAndOpen() {
    return this
      .focusTrigger()
      .pressDownKey();
  }
}

export { DropdownMenuInteractor };
