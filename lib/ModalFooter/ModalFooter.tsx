// @ts-nocheck
/**
 * Modal Footer
 *
 * This is the default modal footer of a typical <Modal /> in the folio system.
 */

import React from "react";
import css from "./ModalFooter.css";
type ModalFooterProps = {
  children?:
    | React.ReactNode
    | React.ReactNode[]
    | Record<string, React.ReactNode>;
};

const ModalFooter = ({ children }: ModalFooterProps) => {
  return <div className={css.modalFooterButtons}>{children}</div>;
};

export default ModalFooter;
