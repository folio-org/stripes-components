/**
 * KeyboardShortcutsModal interactor
 */

import {
  count,
  interactor,
  scoped,
} from '@bigtest/interactor';

import IconButtonInteractor from '../../IconButton/tests/interactor';

export default interactor(class KeyboardShortcutsModalInteractor {
  static defaultScope = '[data-test-keyboard-shortcuts-modal]';

  countShortcuts(selector = 'div[data-row-index]') {
    return count(selector);
  }

  closeButton = scoped('[data-test-shortcuts-close-button]', IconButtonInteractor);
  shortcutCount = this.countShortcuts();
});
