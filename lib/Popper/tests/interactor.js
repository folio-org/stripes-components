import {
  interactor,
  isPresent,
  isVisible,
} from '@bigtest/interactor';

export default interactor(class PopperInteractor {
  isDisplayAnchor= isPresent('[data-test-popper-anchor]');
  isDisplayOverlay = isVisible('[data-test-popper-overlay]');
  overlayIsRenderedInPortal = isVisible('#root [data-test-popper-overlay]');
  overlayIsVisible = isVisible('[data-test-popper-overlay]');
});
