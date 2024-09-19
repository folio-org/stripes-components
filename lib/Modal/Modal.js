import React, { forwardRef, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Transition, TransitionGroup } from 'react-transition-group';
import { uniqueId, noop } from 'lodash';
import { getFirstFocusable } from '../../util/getFocusableElements';
import useOverlayContainer from './useOverlayContainer';
import WrappingElement from './WrappingElement';
import { OVERLAY_CONTAINER_ID } from '../../util/consts';
import IconButton from '../IconButton';
import Headline from '../Headline';
import css from './Modal.css';

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
    wrappingElement: wrappingTagName = 'div',
    ...rest
  } = props;
  const modalId = useRef(id || uniqueId('modal')).current;

  // Ref for the dialog element of the modal
  const modalElem = useRef(null);

  // Ref to the outer element provided as props but defaults as a div.
  const wrappingElementRef = useRef(null);

  // get DOM element for portal. Within the FOLIO platform, this will be the `div#OverlayContainer`, but
  // component-level test suites, this could be `div#root`.
  const portalRef = useOverlayContainer(document.getElementById(OVERLAY_CONTAINER_ID));
  // Ref for the element that was focused prior to the modal being opened so that we can return focus when the
  // modal closes.
  const triggerRef = useRef(null);
  // Ref to the element containing the modal content.
  const contentRef = useRef(null);

  const [contentFocused, setContentFocused] = useState(false);

  const refreshPortal = useCallback(() => {
    if (portalRef.element) {
      return portalRef.element;
    }
    portalRef.refresh(true);
    return portalRef.element;
  }, [portalRef.element]);

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

  const handleBackgroundClick = useCallback(() => {
    if (!closeOnBackgroundClick) {
      // the modal isn't closing, so send focus back to the modal...
      sendFocusToModal();
      return;
    }
    onClose();
  }, [closeOnBackgroundClick, onClose, sendFocusToModal]);

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

  // if (!portalRef.element) {
  //   refreshPortal();
  //   return null;
  // }

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
          open={open}
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
            tagName={wrappingTagName}
            triggerRef={triggerRef}
            portalElement={portalRef.element}
            modalElementRef={modalElem}
            onClose={onClose}
            onOpen={onOpen}
            setContentFocused={setContentFocused}
            enforceFocus={enforceFocus}
            restoreFocus={restoreFocus}
            sendFocusToModal={sendFocusToModal}
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
