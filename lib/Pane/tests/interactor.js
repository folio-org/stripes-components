import {
  interactor,
  attribute,
  scoped,
} from '@bigtest/interactor';

import PaneHeaderInteractor from '../../PaneHeader/tests/interactor';
import { computedStyle } from '../../../tests/helpers';

export default interactor(class PaneInteractor {
  static defaultScope = '[class*=pane---]';

  computedWidth = computedStyle(this.$element, 'width')
  style = attribute('style');
  dismissButton = scoped('[data-test-pane-header-dismiss-button]');
  content = attribute('[class*=paneContent---]', 'style');
  header = scoped('[data-test-pane-header]', PaneHeaderInteractor);
});
