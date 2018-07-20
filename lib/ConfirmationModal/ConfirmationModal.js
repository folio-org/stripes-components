import React from 'react';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';

import injectIntl from '../InjectIntl';
import Modal from '../Modal';
import ModalFooter from '../ModalFooter';
import css from './ConfirmationModal.css';

const propTypes = {
  buttonStyle: PropTypes.string,
  cancelButtonStyle: PropTypes.string,
  cancelLabel: PropTypes.node,
  confirmLabel: PropTypes.node,
  heading: PropTypes.string.isRequired,
  id: PropTypes.string,
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
  const testId = props.id || uniqueId('confirmation-');
  const cancelLabel = props.cancelLabel || props.intl.formatMessage({ id: 'stripes-components.cancel' });
  const confirmLabel = props.confirmLabel || props.intl.formatMessage({ id: 'stripes-components.submit' });

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

export default injectIntl(ConfirmationModal);
