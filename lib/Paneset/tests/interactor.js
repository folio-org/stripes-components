import {
  interactor,
  collection,
  Interactor,
} from '@bigtest/interactor';

import paneInteractor from '../../Pane/tests/interactor';
import css from '../Paneset.css';
import paneCss from '../../Pane/Pane.css';

export default interactor(class PaneSetInteractor {
  static defaultScope = `.${css.paneset}`;
  panes = collection(`.${paneCss.pane}`, paneInteractor);
  testElement = new Interactor('[data-test]');
});
