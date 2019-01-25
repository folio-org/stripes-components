import {
  clickable,
  hasClass,
  interactor,
  isVisible,
} from '@bigtest/interactor';

export default interactor(class DropdownButtonInteractor {
  clickButton = clickable('[data-role="toggle"]');
  clickOutsideOfDropdownContent = clickable('[data-test-other-content]');

  contentIsShown = isVisible('[data-role="menu"]');
  iconPointsUp = hasClass('svg', 'icon-triangle-up');
  iconPointsDown = hasClass('svg', 'icon-triangle-down');
});
