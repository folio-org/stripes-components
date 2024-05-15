import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';

import Button from '../Button';
import Modal from '../Modal';
import ModalFooter from '../ModalFooter';
import css from './ConfirmationModal.css';

const focusFooterPrimary = ref => ref.current.focus();

const propTypes = {
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
    isConfirmButtonDisabled = false,
    ...rest
  }) => {
  const props = { Element, buttonStyle, cancelButtonStyle, isConfirmButtonDisabled, ...rest };
  const footerPrimary = useRef(null);
  const contentId = useRef(uniqueId('modal-content')).current;
  const testId = props.id || uniqueId('confirmation-');
  const cancelLabel = props.cancelLabel || <FormattedMessage id="stripes-components.cancel" />;
  const confirmLabel = props.confirmLabel || <FormattedMessage id="stripes-components.submit" />;

  const footer = (
    <ModalFooter>
      <Button
        data-test-confirmation-modal-confirm-button
        buttonStyle={props.buttonStyle}
        id={`clickable-${testId}-confirm`}
        onClick={props.onConfirm}
        ref={footerPrimary}
        disabled={isConfirmButtonDisabled}
      >
        {confirmLabel}
      </Button>
      <Button
        data-test-confirmation-modal-cancel-button
        buttonStyle={props.cancelButtonStyle}
        id={`clickable-${testId}-cancel`}
        onClick={props.onCancel}
      >
        {cancelLabel}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={props.open}
      onClose={props.onCancel}
      onOpen={() => { focusFooterPrimary(footerPrimary); }}
      id={testId}
      label={props.heading}
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
        {props.message}
      </Element>
    </Modal>
  );
};

ConfirmationModal.propTypes = propTypes;

export default ConfirmationModal;
