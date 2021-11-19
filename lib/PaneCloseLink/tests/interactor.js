import {
  interactor,
  isPresent,
} from '@bigtest/interactor';
import css from '../PaneCloseLink.css';

export default interactor(class PaneCloseLinkInteractor {
  static defaultScope = '[class*=paneCloseLink---]';
  displaysX = isPresent('[class*=paneCloseLinkX---]');
  displaysArrow = isPresent('[class*=paneCloseLinkArrow---]');
});
