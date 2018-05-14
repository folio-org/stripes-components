import React from 'react';
import { intlShape } from 'react-intl';
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
  cancelButtonStyle: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const defaultProps = {
  buttonStyle: 'primary',
  cancelButtonStyle: 'default',
};

const contextTypes = {
  intl: intlShape
};

const ConfirmationModal = (props, context) => {
  const testId = props.heading.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const formatMsg = context.intl.formatMessage;
  const cancelLabel = props.cancelLabel || formatMsg({ id: 'stripes-components.cancel' });
  const confirmLabel = props.confirmLabel || formatMsg({ id: 'stripes-components.submit' });
  return (
    <Modal
      open={props.open}
      label={props.heading}
      id={`${testId}-confirmation-modal`}
      scope="module"
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
          <Button buttonStyle={props.cancelButtonStyle} onClick={props.onCancel} id={`clickable-${testId}-confirmation-cancel`}>{cancelLabel}</Button>
          <Button buttonStyle={props.buttonStyle} onClick={props.onConfirm} id={`clickable-${testId}-confirmation-confirm`}>{confirmLabel}</Button>
        </Col>
      </Row>
    </Modal>
  );
};

ConfirmationModal.propTypes = propTypes;
ConfirmationModal.defaultProps = defaultProps;
ConfirmationModal.contextTypes = contextTypes;

export default ConfirmationModal;
