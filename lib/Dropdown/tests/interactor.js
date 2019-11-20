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

export default @interactor class DropdownInteractor {
  triggerDisplayed = isPresent('[aria-haspopup]');
  triggerFocused = is('[aria-haspopup]', ':focus');
  clickTrigger = clickable('[aria-haspopup]');
  isOpen = attribute('[aria-haspopup]', 'aria-expanded');
  focusTrigger = focusable('[aria-haspopup]');
  pressDownKey = triggerable('[aria-haspopup]', 'keydown', { keyCode: 40 });
  focusAndOpen() {
    return this
      .focusTrigger()
      .pressDownKey();
  }
}

@interactor class DropdownMenuItemInteractor {
  isFocused = is(':focus');
  pressDownKey = triggerable('keydown', { keyCode: 40 });
  pressUpKey = triggerable('keydown', { keyCode: 38 });
  pressEscape = triggerable('keydown', { keyCode: 27 });W
}

@interactor class DropdownMenuInteractor {
  items = collection('button, input, a', DropdownMenuItemInteractor);

  isFocused = is(':focus');
}

export { DropdownMenuInteractor };
