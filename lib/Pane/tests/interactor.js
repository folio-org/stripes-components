import {
  interactor
} from '@bigtest/interactor';
import css from '../Pane.css';

export default interactor(class PaneInteractor {
  static defaultScope = `.${css.pane}`;
});
