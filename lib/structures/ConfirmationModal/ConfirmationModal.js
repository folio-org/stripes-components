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
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const defaultProps = {
  cancelLabel: 'Cancel',
  confirmLabel: 'Submit',
};

const ConfirmationModal = props => (
  <Modal
    open={props.open}
    label={props.heading}
    id={props.heading}
    scope="root"
    size="small"
    showHeader={false}
  >
    <h1>{props.heading}</h1>
    <Row>
      <Col xs>
        <p>{props.message}</p>
      </Col>
    </Row>
    <Row>
      <Col xs>
        <Button buttonStyle="secondary" onClick={props.onCancel}>{props.cancelLabel}</Button>
        <Button onClick={props.onConfirm}>{props.confirmLabel}</Button>
      </Col>
    </Row>
  </Modal>
);

ConfirmationModal.propTypes = propTypes;
ConfirmationModal.defaultProps = defaultProps;

export default ConfirmationModal;
