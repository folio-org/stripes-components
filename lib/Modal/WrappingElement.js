import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback
} from 'react';
import PropTypes from 'prop-types';
import * as focusTrap from 'focus-trap';
import { listen } from '../util/listen';
import StripesOverlayWrapper from '../util/StripesOverlayWrapper';
import { OVERLAY_CONTAINER_SELECTOR } from '../util/consts';
import calloutCSS from '../Callout/Callout.css';
import overlayCSS from '../Popper/Popper.css';
import css from './Modal.css';

// applies/removes the `inert` attribute to elements outside of the `OverlayContainer` element.
// `inert` blocks focus/mouse clicks as well as prevents screen readers from accessing those parts
// of the document.
export function useAssistiveTechTrap() {
  const apply = () => {
    const mainNav = document.querySelector('header[class^=navRoot]'); // main navigation
    const overlaySiblings = Array.from(document.querySelectorAll(     // siblings of the overlay container
      `${OVERLAY_CONTAINER_SELECTOR} ~ *`
    ));
    const elementList = [mainNav, ...overlaySiblings];
    elementList.forEach(el => el?.setAttribute?.('inert', ''));
  }

  const release = () => {
    const inertElements = Array.from(document.querySelectorAll('[inert]'));
    inertElements?.forEach(el => el?.removeAttribute?.('inert'));
  }

  return {
    release,
    apply
  }
}

const WrappingElement = forwardRef(({
  children,
  enforceFocus,
  tagName = 'div',
  portalElement,
  triggerRef,
  modalElementRef,
  onClose,
  onOpen,
  setContentFocused,
  restoreFocus,
  sendFocusToModal,
  ...rest
}, ref) => {
  // Ref to the outer element provided as props but defaults as a div.
  const wrappingElementRef = useRef(null);

  // imperitive handle since we want to provide the wrapping element ref to the consuming app as the 'ref' prop.
  useImperativeHandle(ref, () => wrappingElementRef.current, [wrappingElementRef]);

  // Ref for the `focus-trap` instance.
  const focusTrapRef = useRef(null);

  // refs to hold handler-removal functions so that any DOM-level listeners can be removed when the modal is hidden
  // or dismounts.
  const keyDownHandlerRef = useRef(null);
  const focusHandlerRef = useRef(null);

  // mechanism for applying 'inert' attribute (screen-reader trap);
  const ATTrap = useAssistiveTechTrap();

  // keydown Handler for detecting 'escape' key presses...
  const keyDownHandler = useCallback((e) => {
    if (e.key.toLowerCase() === 'escape') {
      e.preventDefault();
      onClose();
    }
  }, [onClose]);

  // if focus is outside of the modal or acceptable containers, return it to the modal.
  const enforceFocusHandler = useCallback(() => {
    // collect possible DOM elements for focus when a modal is active (<Modal>s, <Callout>s, <Popper>s (overlays)).
    // check if the active element is contained among them to prevent multiple modals from fighting over focus.
    const containers = Array.from(document.querySelectorAll(
      `.${css.modalRoot}, .${calloutCSS.callout}, .${overlayCSS.overlay}`
    ));
    const focusIsWithin = containers.some((m) => m.contains(document.activeElement));

    if (!focusIsWithin) {
      sendFocusToModal();
    }
  }, [sendFocusToModal]);

  const enforceFocusTimeout = useCallback(() => {
    setTimeout(enforceFocusHandler);
  }, [enforceFocusHandler]);

  // open/closed effects - sending focus to modal, setting up focus-trapping,
  // keyboard/focus listeners...
  useEffect(() => {
    if (!triggerRef.current) {
      triggerRef.current = document.activeElement;
    }

    const modalContainsFocus = modalElementRef.current?.contains(document.activeElement);
    if (!modalContainsFocus) {
      sendFocusToModal();
    }

    if (modalElementRef.current) {
      // create the focus trap if we don't already have one.
      if (!focusTrapRef.current) {
        focusTrapRef.current = focusTrap.createFocusTrap(portalElement, {
          returnFocusOnDeactivate: false,
          checkCanReturnFocus: null,
          fallbackFocus: modalElementRef.current,
          // we handle our own deactivation when the modal closes...
          clickOutsideDeactivates: false,
        });
      }

      if (enforceFocus) {
        focusTrapRef.current.activate();
        ATTrap.apply();
      }
      keyDownHandlerRef.current = listen(modalElementRef.current, 'keydown', keyDownHandler);
      focusHandlerRef.current = listen(document, 'focus', enforceFocusTimeout, true);
      onOpen();
    }

    return () => {
      if (focusTrapRef.current?.active) {
        focusTrapRef.current?.deactivate({
          returnFocus: false,
          checkCanReturnFocus: null
        });
      }

      focusTrapRef.current = null;
      ATTrap.release();

      keyDownHandlerRef.current?.();
      focusHandlerRef.current?.();

      // if lastActive is within the modal itself, focusManagement was probably handled
      // outside of the component, so don't do anything if the suspected trigger is inside of the modal.
      setContentFocused(false);
      if (restoreFocus) triggerRef.current?.focus();
    }
  }, []);

  const WrappingElementComponent = tagName;
  return (
    <WrappingElementComponent
      ref={wrappingElementRef}
      {...rest}
    >
      <StripesOverlayWrapper>
        {children}
      </StripesOverlayWrapper>
    </WrappingElementComponent>
  );
});

WrappingElement.propTypes = {
  children: PropTypes.node,
  enforceFocus: PropTypes.bool,
  modalElementRef: PropTypes.object,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  portalElement: PropTypes.instanceOf(HTMLElement),
  restoreFocus: PropTypes.bool,
  sendFocusToModal: PropTypes.func,
  setContentFocused: PropTypes.func,
  tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  triggerRef: PropTypes.object,
}

export default WrappingElement;
