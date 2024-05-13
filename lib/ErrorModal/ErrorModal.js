import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import Modal from '../Modal';
import ModalFooter from '../ModalFooter';

const ErrorModal = ({
  ariaLabel,
  bodyTag: Element = 'div',
  open,
  content,
  label,
  buttonLabel,
  onClose,
  ...rest
}) => {
  const footer = (
    <ModalFooter>
      <Button
        data-test-error-modal-close-button
        onClick={onClose}
      >
        {buttonLabel || <FormattedMessage id="stripes-components.close" />}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      data-test-error-modal
      aria-label={rest['aria-label'] || ariaLabel}
      open={open}
      size="small"
      label={label}
      footer={footer}
    >
      <Element data-test-error-modal-content>
        {content}
      </Element>
    </Modal>
  );
};

ErrorModal.propTypes = {
  ariaLabel: PropTypes.string,
  bodyTag: PropTypes.string,
  buttonLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  content: PropTypes.node.isRequired,
  label: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ErrorModal;
