import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';

import Modal from '../Modal';
import ModalFooter from '../ModalFooter';
import css from './ConfirmationModal.css';

const propTypes = {
  buttonStyle: PropTypes.string,
  cancelButtonStyle: PropTypes.string,
  cancelLabel: PropTypes.node,
  confirmLabel: PropTypes.node,
  heading: PropTypes.node.isRequired,
  id: PropTypes.string,
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
  const testId = props.id || uniqueId('confirmation-');
  const cancelLabel = props.cancelLabel || <FormattedMessage id="stripes-components.cancel" />;
  const confirmLabel = props.confirmLabel || <FormattedMessage id="stripes-components.submit" />;

  const footer = (
    <ModalFooter
      secondaryButton={{
        'label': cancelLabel,
        'onClick': props.onCancel,
        'id': `clickable-${testId}-cancel`,
        'buttonStyle': props.cancelButtonStyle,
        'data-test-confirmation-modal-cancel-button': true,
      }}
      primaryButton={{
        'label': confirmLabel,
        'onClick': props.onConfirm,
        'id': `clickable-${testId}-confirm`,
        'buttonStyle': props.buttonStyle,
        'data-test-confirmation-modal-confirm-button': true,
      }}
    />
  );

  return (
    <Modal
      open={props.open}
      id={testId}
      label={props.heading}
      scope="module"
      size="small"
      footer={footer}
    >
      <p className={css.message}>
        {props.message}
      </p>
    </Modal>
  );
};

ConfirmationModal.propTypes = propTypes;
ConfirmationModal.defaultProps = defaultProps;

export default ConfirmationModal;
