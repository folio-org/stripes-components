import {
  hasClass,
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class DropdownButtonInteractor {
  iconPointsUp = hasClass('svg', 'icon-triangle-up');
  iconPointsDown = hasClass('svg', 'icon-triangle-down');

  buttonContentIsShown = isPresent('[data-test-button-content]');
});
