import {
  hasClass,
  interactor,
  count,
  isPresent,
  text,
  isVisible,
} from '@bigtest/interactor';

export default interactor(class PopoverInteractor {
  isOpen = isPresent('[data-test-popover-overlay]');
});
