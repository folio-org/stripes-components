import {
  interactor,
  isPresent,
  isVisible,
} from '@bigtest/interactor';

export default interactor(class PopperInteractor {
  isDisplayAnchor = isPresent('[data-test-popper-anchor]');
  isDisplayOverlay = isPresent('[data-test-popper-overlay]');
  overlayIsRenderedInPortal = isPresent('#root [data-test-popper-overlay]');
  overlayIsVisible = isVisible('[data-test-popper-overlay]');
});
