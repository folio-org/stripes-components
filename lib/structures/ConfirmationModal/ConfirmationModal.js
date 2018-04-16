import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../Modal';
import { Row, Col } from '../../LayoutGrid';
import Button from '../../Button';

const propTypes = {
  heading: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  buttonStyle: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const defaultProps = {
  cancelLabel: 'Cancel',
  confirmLabel: 'Submit',
  buttonStyle: 'primary',
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
      showHeader={false}
    >
      <h1 id={`${testId}-confirmation-modal-heading`}>{props.heading}</h1>
      <Row>
        <Col xs>
          <p id={`${testId}-confirmation-modal-message`}>{props.message}</p>
        </Col>
      </Row>
      <Row>
        <Col xs>
          <Button onClick={props.onCancel} id={`clickable-${testId}-confirmation-cancel`}>{props.cancelLabel}</Button>
          <Button buttonStyle={props.buttonStyle} onClick={props.onConfirm} id={`clickable-${testId}-confirmation-confirm`}>{props.confirmLabel}</Button>
        </Col>
      </Row>
    </Modal>
  );
};

ConfirmationModal.propTypes = propTypes;
ConfirmationModal.defaultProps = defaultProps;

export default ConfirmationModal;
