// @ts-nocheck
import React from "react";
import { FormattedMessage } from "react-intl";

import Button from "../Button";
import Modal from "../Modal";
import ModalFooter from "../ModalFooter";
type ErrorModalProps = {
  ariaLabel?: string;
  bodyTag?: string;
  buttonLabel?: string | React.ReactNode;
  content: React.ReactNode;
  label: React.ReactNode;
  onClose: (...args: any[]) => any;
  open: boolean;
};

const ErrorModal = ({
  ariaLabel,
  bodyTag: Element = "div",
  open,
  content,
  label,
  buttonLabel,
  onClose,
  ...rest
}: ErrorModalProps) => {
  const footer = (
    <ModalFooter>
      <Button data-test-error-modal-close-button onClick={onClose}>
        {buttonLabel || <FormattedMessage id="stripes-components.close" />}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      data-test-error-modal
      aria-label={rest["aria-label"] || ariaLabel}
      open={open}
      size="small"
      label={label}
      footer={footer}
    >
      <Element data-test-error-modal-content>{content}</Element>
    </Modal>
  );
};

export default ErrorModal;
