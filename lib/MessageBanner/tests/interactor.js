/**
 * MessageBanner interactor
 */

import {
  interactor,
  text,
  hasClass,
  attribute,
  property,
} from '@bigtest/interactor';
import IconButtonInteractor from '../../IconButton/tests/interactor';
import IconInteractor from '../../Icon/tests/interactor';

import css from '../MessageBanner.module.css';

export default interactor(class MessageBannerInteractor {
  static defaultScope = '[data-test-message-banner]';
  className = attribute('class');
  text = text(`.${css.content}`);
  element = property('tagName');

  isDefault = hasClass(css['type-default']);
  isWarning = hasClass(css['type-warning']);
  isError = hasClass(css['type-error']);
  isSuccess = hasClass(css['type-success']);

  dismissButton = new IconButtonInteractor('[data-test-message-dismiss-button]');
  icon = new IconInteractor('[data-test-message-icon]')
});
