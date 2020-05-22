/**
 * Tooltip interactor
 */

import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class TooltipInteractor {
  isTooltipVisible = isPresent('[data-test-tooltip]');
  hasText = isPresent('[data-test-tooltip-text]');
  hasSub = isPresent('[data-test-tooltip-sub]');
  hasProximityElement = isPresent('[data-test-tooltip-proximity-element]');
});
