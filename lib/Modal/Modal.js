import React, { forwardRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal as OverlayModal } from 'react-overlays';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Transition, TransitionGroup } from 'react-transition-group';

import IconButton from '../IconButton';
import Headline from '../Headline';
import css from './Modal.css';

const propTypes = {
  ariaLabel: PropTypes.string,
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

const defaultProps = {
  closeOnBackgroundClick: false,
  dismissible: false,
  enforceFocus: true,
  onOpen: () => { },
  open: false,
  restoreFocus: true,
  scope: 'module',
  showHeader: true,
  size: 'medium',
  wrappingElement: 'div',
};

const Modal = forwardRef((props, ref) => {
  const {
    children,
    closeOnBackgroundClick,
    contentClass,
    dismissible,
    enforceFocus,
    footer,
    id,
    onClose,
    onOpen,
    open,
    restoreFocus,
    scope,
    showHeader,
    size,
    wrappingElement,
    ...rest
  } = props;

  const WrappingElement = wrappingElement;

  const getModalScope = () => {
    let container;

    if (scope === 'module') {
      container = document.getElementById('OverlayContainer');
    }

    return container;
  };

  const getModalClass = () => classNames(
    css.modal,
    css[size],
  );

  const getContentClass = () => classNames(
    css.modalContent,
    contentClass,
  );

  const renderBackdrop = ({ onClick, ref: backdropRef, style }) => { /* eslint-disable-line react/prop-types */
    const handleClick = closeOnBackgroundClick ? onClick : undefined;

    /* eslint-disable-next-line */
    return (<div className={css.backdrop} onClick={handleClick} style={style} ref={backdropRef} />);
  };

  return (
    <TransitionGroup>
      {open &&
        <Transition
          in={open}
          unmountOnExit
          timeout={400}
          appear
        >
          {
            (status) => (
              <OverlayModal
                show={open}
                className={classNames(css.modalRoot, css[status])}
                container={getModalScope()}
                onHide={onClose}
                onShow={onOpen}
                onBackdropClick={closeOnBackgroundClick ? onClose : () => { }}
                enforceFocus={enforceFocus}
                restoreFocus={restoreFocus}
                renderBackdrop={renderBackdrop}
              >
                <WrappingElement
                  className={getModalClass()}
                  aria-label={rest['aria-label'] || props.ariaLabel}
                  id={props.id}
                  ref={ref}
                  {...rest}
                >
                  {showHeader &&
                    <div className={css.modalHeader}>
                      <Headline
                        tag="h1"
                        size="small"
                        margin="none"
                        className={css.modalLabel}
                        id={id && `${id}-label`}
                      >
                        {props.label}
                      </Headline>
                      <div className={css.modalControls}>
                        {dismissible &&
                          <FormattedMessage id="stripes-components.dismissModal">
                            {ariaLabel => (
                              <IconButton
                                className={css.closeModal}
                                id={id && `${id}-close-button`}
                                onClick={onClose}
                                aria-label={ariaLabel}
                                icon="times"
                              />
                            )}
                          </FormattedMessage>
                        }
                      </div>
                    </div>
                  }
                  <div className={getContentClass()} id={id && `${id}-content`}>
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
              </OverlayModal>
            )
          }
        </Transition>
      }
    </TransitionGroup>
  );
});

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
