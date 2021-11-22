import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class PaneCloseLinkInteractor {
  static defaultScope = '[class*=paneCloseLink---]';
  displaysX = isPresent('[class*=paneCloseLinkX---]');
  displaysArrow = isPresent('[class*=paneCloseLinkArrow---]');
});
