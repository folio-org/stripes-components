import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';

import Button from '../Button';
import Modal from '../Modal';
import ModalFooter from '../ModalFooter';
import css from './ConfirmationModal.css';

const focusFooterPrimary = ref => ref.current.focus();

export const ConfirmationModalPropTypes = {
  bodyTag: PropTypes.string,
  buttonStyle: PropTypes.string,
  cancelButtonStyle: PropTypes.string,
  cancelLabel: PropTypes.node,
  confirmLabel: PropTypes.node,
  heading: PropTypes.node.isRequired,
  id: PropTypes.string,
  isConfirmButtonDisabled: PropTypes.bool,
  message: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const ConfirmationModal = ({
  bodyTag: Element = 'p',
  buttonStyle = 'primary',
  cancelButtonStyle = 'default',
  id,
  isConfirmButtonDisabled = false,
  cancelLabel,
  confirmLabel,
  heading,
  onConfirm,
  onCancel,
  open,
  message,
  ...rest
}) => {
  const footerPrimary = useRef(null);
  const contentId = useRef(uniqueId('modal-content')).current;
  const testId = id || uniqueId('confirmation-');
  const cancelButtonLabel = cancelLabel || <FormattedMessage id="stripes-components.cancel" />;
  const confirmButtonLabel = confirmLabel || <FormattedMessage id="stripes-components.submit" />;

  const footer = (
    <ModalFooter>
      <Button
        data-test-confirmation-modal-confirm-button
        buttonStyle={buttonStyle}
        id={`clickable-${testId}-confirm`}
        onClick={onConfirm}
        ref={footerPrimary}
        disabled={isConfirmButtonDisabled}
      >
        {confirmButtonLabel}
      </Button>
      <Button
        data-test-confirmation-modal-cancel-button
        buttonStyle={cancelButtonStyle}
        id={`clickable-${testId}-cancel`}
        onClick={onCancel}
      >
        {cancelButtonLabel}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={open}
      onClose={onCancel}
      onOpen={() => { focusFooterPrimary(footerPrimary); }}
      id={testId}
      label={heading}
      aria-labelledby={contentId}
      scope="module"
      size="small"
      footer={footer}
    >
      <Element
        data-test-confirmation-modal-message
        className={css.message}
        id={contentId}
      >
        {message}
      </Element>
    </Modal>
  );
};

ConfirmationModal.propTypes = ConfirmationModalPropTypes;

export default ConfirmationModal;
