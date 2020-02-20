/**
 * Highlighter -> interactor
 */

import {
  interactor,
  count
} from '@bigtest/interactor';

export default interactor(class HighlighterInteractor {
  static defaultScope = '[data-test-highlighter]';

  highlightedWordCount = count('[data-test-highlighter-mark]');
});
