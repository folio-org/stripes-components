import React from 'react';
import { intlShape } from 'react-intl';
import { Modal as OverlayModal } from 'react-overlays';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import IconButton from '../IconButton';
import css from './Modal.css';

const propTypes = {
  /** Deciding value for rendering the modal(true) or not(false). */
  open: PropTypes.bool,
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
  size: PropTypes.oneOf(['small', 'medium', 'large']), // eslint-disable-line react/no-unused-prop-types
  /** Parent element for modal.
   * Defaults to 'module' which keeps the main navigation visible.
   * A value of 'root' covers the entire view.
   */
  scope: PropTypes.oneOf([ // eslint-disable-line react/no-unused-prop-types
    'root',
    'module',
  ]),
  /** Unique identifier for modal window. */
  id: PropTypes.string,
  /** Modal can be dismissed by clicking the background overlay */
  closeOnBackgroundClick: PropTypes.bool,
  /** Descriptive title for top of modal - also fills aria-label attribute for screen readers. */
  label: PropTypes.string.isRequired,
  /** If true, renders a close 'X' in the starting corner of the modal */
  dismissible: PropTypes.bool,
  children: PropTypes.node.isRequired,
  showHeader: PropTypes.bool,
  /**
   * When `true` The modal will prevent focus from leaving the Modal while open.
   *
   * Generally this should never be set to `false` as it makes the Modal less
   * accessible to assistive technologies, like screen readers.
   */
  enforceFocus: PropTypes.bool,
};

const defaultProps = {
  scope: 'module',
  onOpen: () => { },
  closeOnBackgroundClick: false,
  dismissible: false,
  open: false,
  showHeader: true,
  size: 'medium',
  enforceFocus: true,
};

const contextTypes = {
  intl: intlShape,
};

const Modal = (props, context) => {
  function getModalScope() {
    let container;
    switch (props.scope) {
      case 'module':
        container = document.getElementById('ModuleContainer');
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

  const dismissMsg = context.intl.formatMessage({ id: 'stripes-components.dismissModal' });

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
    >
      <div
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
      </div>
    </OverlayModal>
  );
};

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;
Modal.contextTypes = contextTypes;

export default Modal;
