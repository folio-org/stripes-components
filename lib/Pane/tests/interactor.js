import {
  interactor,
  attribute,
  scoped,
} from '@bigtest/interactor';

import PaneHeaderInteractor from '../../PaneHeader/tests/interactor';
import { computedStyle } from '../../../tests/helpers';

import css from '../Pane.css';

export default interactor(class PaneInteractor {
  static defaultScope = `.${css.pane}`;

  computedWidth = computedStyle(this.$element, 'width')
  style = attribute('style');
  dismissButton = scoped('[data-test-pane-header-dismiss-button]');
  content = attribute(`${css.paneContent}`, 'style');
  header = new PaneHeaderInteractor();
});
