/**
 * Modal Footer
 *
 * This is the default modal footer of a typical <Modal /> in the folio system.
 */

import React from 'react';
import PropTypes from 'prop-types';
import css from './ModalFooter.css';

const ModalFooter = ({ children }) => {
  return (
    <div className={css.modalFooterButtons}>
      {children}
    </div>
  );
};

ModalFooter.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.objectOf(PropTypes.node),
  ]),
};

export default ModalFooter;
