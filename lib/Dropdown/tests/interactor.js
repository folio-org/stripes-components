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
  triggerDownKey = triggerable('keydown', { keyCode: 40 });

  clickAndFocus() {
    return this
      .clickTrigger()
      .focusTrigger();
  }
}

export default DropdownInteractor;
