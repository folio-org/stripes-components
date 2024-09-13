import React, { forwardRef, useRef, useEffect, useImperativeHandle, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { FormattedMessage } from 'react-intl';
import * as focusTrap from 'focus-trap';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Transition, TransitionGroup } from 'react-transition-group';
import { uniqueId, noop } from 'lodash';
import useOverlayContainer from './useOverlayContainer';
import { listen } from '../../util/listen';
import { getFirstFocusable } from '../../util/getFocusableElements';
import { MAIN_NAVIGATION_SELECTOR, OVERLAY_CONTAINER_SELECTOR, OVERLAY_CONTAINER_ID } from '../../util/consts';
import IconButton from '../IconButton';
import Headline from '../Headline';
import css from './Modal.css';
import calloutCSS from '../Callout/Callout.css';
import overlayCSS from '../Popper/Popper.css';

/**  getA11yLabel will return the appropriate labelling aria-attribute based on the props passed to the component
* in HTML usage, if both "aria-label' is used, it will be applied. By default, the Modal will be labeled by its supplied
* `label` prop, courtesy of an `aria-labelledby` attribute point to the internally rendered Headline.
*/
function getA11yLabel(props, labelId) {
  const ariaLabelProp = props.ariaLabel || props['aria-label'];
  const ariaLabelledbyProp = props.ariaLabelledBy || props['aria-labelledby'];

  if (ariaLabelProp && ariaLabelledbyProp) {
    return { 'aria-labelledby': `${labelId} ${ariaLabelledbyProp}` };
  } else if (ariaLabelProp) {
    return { 'aria-label': ariaLabelProp };
  } else if (ariaLabelledbyProp) {
    return { 'aria-labelledby': ariaLabelledbyProp };
  }
  return { 'aria-labelledby': labelId };
}

// applies/removes the `inert` attribute to elements outside of the `OverlayContainer` element.
// `inert` blocks focus/mouse clicks as well as prevents screen readers from accessing those parts
// of the document.
export function useAssistiveTechTrap() {
  const apply = () => {
    const mainNav = document.querySelector(MAIN_NAVIGATION_SELECTOR); // main navigation
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

const propTypes = {
  ariaLabel: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  children: PropTypes.node.isRequired,
  /** Modal can be dismissed by clicking the background overlay */
  closeOnBackgroundClick: PropTypes.bool,
  /* Apply custom CSS classes on the content element */
  contentClass: PropTypes.string,
  /** If true, renders a close 'X' in the starting corner of the modal */
  dismissible: PropTypes.bool,
  /**
   * When `true` The modal will prevent focus from leaving the Modal while open.
   *
   * Generally this should never be set to `false` as it makes the Modal less
   * accessible to assistive technologies, like screen readers.
   */
  enforceFocus: PropTypes.bool,

  /* Add a footer to the Modal (Optional) */
  footer: PropTypes.node,

  /** Unique identifier for modal window. */
  id: PropTypes.string,
  /** Descriptive title for top of modal. */
  label: PropTypes.node.isRequired,
  /** Callback that signals intent to close window -
   * boolean passed to 'open' prop can be set using
   * callback does not actually close the modal.
   */
  onClose: PropTypes.func,
  /** Callback triggered when modal opens */
  onOpen: PropTypes.func,
  /** Size defaults to 60% the scope element's width.
   * "Small" can be applied for 40% and "Large" for 90%.
   */
  /** Deciding value for rendering the modal(true) or not(false). */
  open: PropTypes.bool,
  /** When `true` The modal will restore focus to previously focused element once modal is hidden */
  restoreFocus: PropTypes.bool,
  scope: PropTypes.oneOf([
    'root',
    'module',
  ]),
  showHeader: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Parent element for modal.
   * Defaults to 'module' which keeps the main navigation visible.
   * A value of 'root' covers the entire view.
   */

  /* Optionally update the wrapping element if needed - useful if the modal itself is a form */
  wrappingElement: PropTypes.oneOf(['div', 'form']),
};

const Modal = forwardRef((props, ref) => {
  const {
    ariaLabel,
    ariaLabelledBy,
    children,
    closeOnBackgroundClick = false,
    contentClass,
    dismissible = false,
    enforceFocus = true,
    footer,
    id,
    onClose = noop,
    onOpen = noop,
    open = false,
    restoreFocus = true,
    scope = 'module',
    showHeader = true,
    size = 'medium',
    wrappingElement = 'div',
    ...rest
  } = props;
  const modalId = useRef(id || uniqueId('modal')).current;

  // get DOM element for portal. Within the FOLIO platform, this will be the `div#OverlayContainer`, but
  // component-level test suites, this could be `div#root`.
  const portalRef = useOverlayContainer(document.getElementById(OVERLAY_CONTAINER_ID));
  // Ref for the `focus-trap` instance.
  const focusTrapRef = useRef(null);
  // Ref for the dialog element of the modal
  const modalElem = useRef(null);
  // Ref for the element that was focused prior to the modal being opened so that we can return focus when the
  // modal closes.
  const triggerRef = useRef(null);
  // Ref to the element containing the modal content.
  const contentRef = useRef(null);
  // Ref to the outer element provided as props but defaults as a div.
  const wrappingElementRef = useRef(null);

  // mechanism for applying 'inert' attribute (screen-reader trap);
  const ATTrap = useAssistiveTechTrap();

  // imperitive handle since we want to provide the wrapping element ref to the consuming app as the 'ref' prop.
  useImperativeHandle(ref, () => wrappingElementRef.current, [wrappingElementRef]);

  // refs to hold handler-removal functions so that any DOM-level listeners can be removed when the modal is hidden
  // or dismounts.
  const keyDownHandlerRef = useRef(null);
  const focusHandlerRef = useRef(null);

  // keydown Handler for detecting 'escape' key presses...
  const keyDownHandler = useCallback((e) => {
    if (e.key.toLowerCase() === 'escape') {
      e.preventDefault();
      onClose();
    }
  }, [onClose]);

  const [contentFocused, setContentFocused] = useState(false);

  // focus the first focusable element in the modal, falling back to the content
  // element itself if none is available...
  const sendFocusToModal = useCallback(() => {
    if (wrappingElementRef.current) {
      const firstFocusable = getFirstFocusable(wrappingElementRef.current);
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        contentRef.current?.focus();
      }
    }
  }, [wrappingElementRef]);

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

  // mount/dismount effect - deactivate focus-trapping on dismount.
  useEffect(() => {
    return () => {
      if (focusTrapRef.current?.active) {
        focusTrapRef.current?.deactivate({
          returnFocus: false,
          checkCanReturnFocus: null
        });
      }
      ATTrap.release();
    }
  }, []);

  const refreshPortal = useCallback(() => {
    if (portalRef.element) {
      return portalRef.element;
    }
    portalRef.refresh(true);
    return portalRef.element;
  }, [portalRef.element]);

  // open/closed effects - sending focus to modal, setting up focus-trapping,
  // keyboard/focus listeners...
  useEffect(() => {
    if (open) {
      const portal = refreshPortal();
      if (modalElem.current &&
        !triggerRef.current &&
        !modalElem.current?.contains(document.activeElement)) {
        triggerRef.current = document.activeElement;
        sendFocusToModal();
      }

      if (modalElem.current) {
        // create the focus trap if we don't already have one.
        if (!focusTrapRef.current) {
          focusTrapRef.current = focusTrap.createFocusTrap(portal, {
            returnFocusOnDeactivate: false,
            checkCanReturnFocus: null,
            fallbackFocus: modalElem.current,
            // we handle our own deactivation when the modal closes...
            clickOutsideDeactivates: false,
          });
        }

        if (enforceFocus) {
          focusTrapRef.current.activate();
          ATTrap.apply();
        }
        keyDownHandlerRef.current = listen(document, 'keydown', keyDownHandler);
        focusHandlerRef.current = listen(document, 'focus', enforceFocusTimeout, true);
      }
    } else {
      if (focusTrapRef.current?.active) {
        focusTrapRef.current?.deactivate({
          returnFocus: false,
          checkCanReturnFocus: null
        });
        ATTrap.release();
      }

      // if lastActive is within the modal itself, focusManagement was probably handled
      // outside of the component, so don't do anything if the suspected trigger is inside of the modal.
      setContentFocused(false);
      if (restoreFocus) triggerRef.current?.focus();

      keyDownHandlerRef.current?.();
      focusHandlerRef.current?.();
    }

    return () => {
      if (focusTrapRef.current?.active) {
        focusTrapRef.current?.deactivate({
          returnFocus: false,
          checkCanReturnFocus: null
        });
        focusTrapRef.current = null;
        ATTrap.release();
      }
    }
  }, [
    open,
    onClose,
    onOpen,
    restoreFocus,
    enforceFocus,
    sendFocusToModal,
    enforceFocusTimeout,
    keyDownHandler,
    portalRef.element,
    ATTrap,
  ]);

  const handleBackgroundClick = useCallback(() => {
    if (!closeOnBackgroundClick) {
      // the modal isn't closing, so send focus back to the modal...
      sendFocusToModal();
      return;
    }
    onClose();
  }, [closeOnBackgroundClick, onClose, sendFocusToModal]);

  const WrappingElement = wrappingElement;

  const getModalClass = () => classNames(
    css.modal,
    css[size],
  );

  const getContentClass = () => classNames(
    contentClass,
    css.modalContent,
  );

  const focusEntered = useCallback((e) => {
    if (!contentFocused) {
      setContentFocused(true);
      // if modal content is focused via autofocus or some other crafty thing,
      // we can get the target this way by checking when focus first enters the modal..
      triggerRef.current = e.relatedTarget;
    }
  }, [contentFocused]);

  if (!portalRef.element) {
    refreshPortal();
    return null;
  }

  const modalElement = open ? (status) => createPortal(
    (
      <>
        {/* es_lint really wants these elements to have keyboard handlers - but we already allow
            keyboard interaction at a higher level (escape closes)
        */}
        {/* eslint-disable */}
        <div
          className={css.backdrop}
          onClick={handleBackgroundClick}
        />
        <dialog
          className={classNames(css.modalRoot, css[status])}
          ref={modalElem}
          onFocus={focusEntered}
          tabIndex="-1"
          {...getA11yLabel(props, `${modalId}-label`)}
        >
          {/* eslint-enable */}
          <WrappingElement
            className={getModalClass()}
            id={props.id}
            ref={wrappingElementRef}
            {...rest}
          >
            {showHeader &&
              <div className={css.modalHeader}>
                <Headline
                  tag="h1"
                  size="small"
                  margin="none"
                  className={css.modalLabel}
                  id={`${modalId}-label`}
                >
                  {props.label}
                </Headline>
                <div className={css.modalControls}>
                  {dismissible &&
                    <FormattedMessage id="stripes-components.dismissModal">
                      {([intlLabel]) => (
                        <IconButton
                          className={css.closeModal}
                          id={id && `${id}-close-button`}
                          onClick={onClose}
                          aria-label={intlLabel}
                          icon="times"
                        />
                      )}
                    </FormattedMessage>
                  }
                </div>
              </div>
            }
            <div
              className={getContentClass()}
              id={id && `${id}-content`}
              style={{ overflow: 'hidden' }}
              ref={contentRef}
            >
              {/* so that aria-labels will still announce if aria-labelledby is also provided */}
              {((ariaLabel || rest['aria-label']) && (ariaLabelledBy || rest['aria-labelledby']))
              && (
                <div className="sr-only">{ariaLabel || rest['aria-label']}</div>
              )}
              {children}
            </div>
            {
              footer && (
                <div className={css.modalFooter} id={id && `${id}-footer`}>
                  {footer}
                </div>
              )
            }
          </WrappingElement>
        </dialog>
      </>
    ),
    refreshPortal()
  ) : null;

  return modalElement !== null ? (
    <TransitionGroup>
      <Transition
        in={open}
        unmountOnExit
        timeout={400}
        appear
        nodeRef={modalElem}
      >
        {modalElement}
      </Transition>
    </TransitionGroup>
  ) : null;
});

Modal.propTypes = propTypes;

export default Modal;
