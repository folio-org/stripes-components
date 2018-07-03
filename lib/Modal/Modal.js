import React from 'react';
import { intlShape } from 'react-intl';
import { Modal as OverlayModal } from 'react-overlays';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import injectIntl from '../InjectIntl';
import IconButton from '../IconButton';
import css from './Modal.css';

const propTypes = {
  children: PropTypes.node.isRequired,
  /** Modal can be dismissed by clicking the background overlay */
  closeOnBackgroundClick: PropTypes.bool,
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
  footer: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
  ]),

  /** Unique identifier for modal window. */
  id: PropTypes.string,
  intl: intlShape.isRequired,
  /** Descriptive title for top of modal - also fills aria-label attribute for screen readers. */
  label: PropTypes.string.isRequired,
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

const Modal = (props) => {
  const WrappingElement = props.wrappingElement;

  function getModalScope() {
    let container;
    switch (props.scope) {
      case 'module':
        container = document.getElementById('OverlayContainer');
        break;
      default:
        break;
    }
    return container;
  }

  function getModalClass() {
    return classNames(
      css.modal,
      css[props.size],
    );
  }

  const dismissMsg = props.intl.formatMessage({ id: 'stripes-components.dismissModal' });

  return (
    <OverlayModal
      show={props.open}
      backdropClassName={css.backdrop}
      className={css.modalRoot}
      container={getModalScope()}
      onHide={props.onClose}
      onShow={props.onOpen}
      onBackdropClick={props.closeOnBackgroundClick ? props.onClose : () => {}}
      enforceFocus={props.enforceFocus}
      restoreFocus={props.restoreFocus}
    >
      <WrappingElement
        className={getModalClass()}
        aria-label={props['aria-label'] || props.label} // eslint-disable-line react/prop-types
        id={props.id}
      >
        { props.showHeader &&
          <div className={css.modalHeader}>
            <div className={css.modalLabel}>
              {props.label}
            </div>
            <div className={css.modalControls}>
              {props.dismissible &&
                <IconButton
                  className={css.closeModal}
                  onClick={props.onClose}
                  aria-label={dismissMsg}
                  icon="closeX"
                />
              }
            </div>
          </div>
        }
        <div className={css.modalContent}>
          {props.children}
        </div>
        {
          props.footer && (
            <div className={css.modalFooter}>
              {props.footer}
            </div>
          )
        }
      </WrappingElement>
    </OverlayModal>
  );
};

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default injectIntl(Modal);
