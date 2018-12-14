import {
  interactor,
  isPresent,
} from '@bigtest/interactor';
import css from '../PaneCloseLink.css';

export default interactor(class PaneCloseLinkInteractor {
  static defaultScope = `.${css.paneCloseLink}`;
  displaysX = isPresent(`${css.paneCloseLinkX}`);
  displaysArrow = isPresent(`${css.paneCloseLinkArrow}`);
});
