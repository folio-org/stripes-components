import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class PopoverInteractor {
  isOpen = isPresent('[data-test-popover-overlay]');
});
