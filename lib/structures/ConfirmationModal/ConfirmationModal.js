import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../Modal';
import Button from '../../Button';
import Headline from '../../Headline';

const propTypes = {
  heading: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const defaultProps = {
  cancelLabel: 'Cancel',
  confirmLabel: 'Submit',
};

const ConfirmationModal = (props) => {
  const testId = props.heading.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return (
    <Modal
      open={props.open}
      label={props.heading}
      id={`${testId}-confirmation-modal`}
      scope="root"
      size="small"
      dismissible
      closeOnBackgroundClick
      onClose={props.onCancel}
    >
      <div>
        <Headline tag="h3" margin="large" size="small" id={`${testId}-confirmation-modal-message`}>{props.message}</Headline>
        <Button marginBottom0 onClick={props.onCancel} id={`clickable-${testId}-confirmation-cancel`}>{props.cancelLabel}</Button>
        <Button marginBottom0 buttonStyle="primary" onClick={props.onConfirm} id={`clickable-${testId}-confirmation-confirm`} >{props.confirmLabel}</Button>
      </div>
    </Modal>
  );
};

ConfirmationModal.propTypes = propTypes;
ConfirmationModal.defaultProps = defaultProps;

export default ConfirmationModal;
