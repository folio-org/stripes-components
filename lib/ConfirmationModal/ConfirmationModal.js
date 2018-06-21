import React from 'react';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import injectIntl from '../InjectIntl';
import Modal from '../Modal';
import ModalFooter from '../ModalFooter';

const propTypes = {
  buttonStyle: PropTypes.string,
  cancelButtonStyle: PropTypes.string,
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  heading: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  message: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const defaultProps = {
  buttonStyle: 'primary',
  cancelButtonStyle: 'default',
};

const ConfirmationModal = (props) => {
  const testId = props.heading.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const cancelLabel = props.cancelLabel || props.intl.formatMessage({ id: 'stripes-components.cancel' });
  const confirmLabel = props.confirmLabel || props.intl.formatMessage({ id: 'stripes-components.submit' });

  const footer = (
    <ModalFooter
      secondaryButton={{
        label: cancelLabel,
        onClick: props.onCancel,
        id: `clickable-${testId}-confirmation-cancel`,
        buttonStyle: props.cancelButtonStyle,
      }}
      primaryButton={{
        label: confirmLabel,
        onClick: props.onConfirm,
        id: `clickable-${testId}-confirmation-confirm`,
        buttonStyle: props.buttonStyle,
      }}
    />
  );

  return (
    <Modal
      open={props.open}
      id={`${testId}-confirmation-modal`}
      label={<span id={`${testId}-confirmation-modal-heading`}>{props.heading}</span>}
      scope="module"
      size="small"
      footer={footer}
    >
      { props.message && (<span id={`${testId}-confirmation-modal-message`}>{props.message}</span>) }
    </Modal>
  );
};

ConfirmationModal.propTypes = propTypes;
ConfirmationModal.defaultProps = defaultProps;

export default injectIntl(ConfirmationModal);
