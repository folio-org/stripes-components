import {
  hasClass,
  interactor,
  Interactor,
  count,
  isPresent,
  text,
  isVisible,
} from '@bigtest/interactor';

import IconButtonInteractor from '../../IconButton/tests/interactor';
import ButtonInteractor from '../../Button/tests/interactor';

export default interactor(class InfoPopoverInteractor {
  static defaultScope = '[data-test-info-popover]';
  triggerButton = new IconButtonInteractor('[data-test-info-popover-trigger]');
  button = new ButtonInteractor('[data-test-info-popover-button]');
  content = new Interactor('[data-test-info-popover-content]');
});
