import {
  hasClass,
  interactor,
} from '@bigtest/interactor';

import css from '../FocusLink.css';

export default interactor(class FocusLinkInteractor {
  static defaultScope = '[data-test-focus-link]'

  hasFocusLink = hasClass(css.focusLink);
});
