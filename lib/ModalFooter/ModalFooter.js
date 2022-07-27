/**
 * Modal Footer
 *
 * This is the default modal footer of a typical <Modal /> in the folio system.
 */

import React from 'react';
import PropTypes from 'prop-types';
import css from './ModalFooter.css';

const ModalFooter = ({ children, buttonsAlignReverse }) => {
  const modalFooterButtonsClassName =
    `${css.modalFooterButtons}`
    + ' '
    + `${buttonsAlignReverse ? css.flexDirectionRow : css.flexDirectionRowReverse}`;
  return (
    <div className={modalFooterButtonsClassName}>
      {children}
    </div>
  );
};

ModalFooter.propTypes = {
  buttonsAlignReverse:PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.objectOf(PropTypes.node),
  ]),
};
ModalFooter.defaultProps = {
  buttonsAlignReverse: false
};

export default ModalFooter;
