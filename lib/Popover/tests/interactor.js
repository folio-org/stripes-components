import {
  interactor,
  isPresent,
  triggerable
} from '@bigtest/interactor';

export default interactor(class PopoverInteractor {
  isOpen = isPresent('[data-test-popover-overlay]');
  pressEscape = triggerable('keyup', { key: 'Escape', keyCode: 27 });
});
