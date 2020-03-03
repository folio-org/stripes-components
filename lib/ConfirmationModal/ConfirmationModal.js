import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';

import Button from '../Button';
import Modal from '../Modal';
import ModalFooter from '../ModalFooter';
import css from './ConfirmationModal.css';

const propTypes = {
  bodyTag: PropTypes.string,
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
  bodyTag: 'p',
  buttonStyle: 'primary',
  cancelButtonStyle: 'default',
};

const ConfirmationModal = (props) => {
  const testId = props.id || uniqueId('confirmation-');
  const cancelLabel = props.cancelLabel || <FormattedMessage id="stripes-components.cancel" />;
  const confirmLabel = props.confirmLabel || <FormattedMessage id="stripes-components.submit" />;
  const { bodyTag: Element } = props;

  const footer = (
    <ModalFooter>
      <Button
        data-test-confirmation-modal-confirm-button
        buttonStyle={props.buttonStyle}
        id={`clickable-${testId}-confirm`}
        onClick={props.onConfirm}
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
      id={testId}
      label={props.heading}
      scope="module"
      size="small"
      footer={footer}
    >
      <Element
        data-test-confirmation-modal-message
        className={css.message}
      >
        {props.message}
      </Element>
    </Modal>
  );
};

ConfirmationModal.propTypes = propTypes;
ConfirmationModal.defaultProps = defaultProps;

export default ConfirmationModal;
