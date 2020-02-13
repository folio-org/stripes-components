import {
  interactor,
  attribute,
  scoped,
} from '@bigtest/interactor';

import css from '../Pane.css';

export default interactor(class PaneInteractor {
  static defaultScope = `.${css.pane}`;
  style = attribute('style');
  dismissButton = scoped('[data-test-pane-header-dismiss-button]');
  content = attribute(`${css.paneContent}`, 'style');
});
