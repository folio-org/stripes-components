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
  triggerable,
} from '@bigtest/interactor';

@interactor class DropdownInteractor {
  triggerDisplayed = isPresent('[aria-haspopup]');
  triggerFocused = is('[aria-haspopup]', ':focus');
  clickTrigger = clickable('[aria-haspopup]');
  isOpen = attribute('[aria-haspopup]', 'aria-expanded');
  focusTrigger = focusable('[aria-haspopup]');
  pressDownKey = triggerable('[aria-haspopup]', 'keydown', { keyCode: 40 });
  pressEscape = triggerable('[aria-haspopup', 'keydown', { keyCode: 27 });
}

export default DropdownInteractor;
