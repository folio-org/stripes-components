import React from 'react';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import injectIntl from '../InjectIntl';
import Modal from '../Modal';
import { Row, Col } from '../LayoutGrid';
import Button from '../Button';

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
          <Button
            buttonStyle={props.cancelButtonStyle}
            onClick={props.onCancel}
            id={`clickable-${testId}-confirmation-cancel`}
          >
            {cancelLabel}
          </Button>
          <Button
            buttonStyle={props.buttonStyle}
            onClick={props.onConfirm}
            id={`clickable-${testId}-confirmation-confirm`}
          >
            {confirmLabel}
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

ConfirmationModal.propTypes = propTypes;
ConfirmationModal.defaultProps = defaultProps;

export default injectIntl(ConfirmationModal);
