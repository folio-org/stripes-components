/**
 * Modal Footer
 *
 * This is the default modal footer of a typical <Modal /> in the folio system.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button, { propTypes as buttonPropTypes } from '../Button/Button';
import css from './ModalFooter.css';

const ModalFooter = ({ primaryButton, secondaryButton }) => {
  // Rendered buttons are identical except for the label and buttonStyle
  const renderButton = (buttonStyle, props) => {
    const { label, ...rest } = props; // eslint-disable-line react/prop-types
    return (
      <Button
        {...rest}
        buttonStyle={buttonStyle}
        buttonClass={css.modalFooterButton}
      >
        {label}
      </Button>
    );
  };

  return (
    <div className={css.modalFooterButtons}>
      {primaryButton ? renderButton('primary', primaryButton) : null}
      {secondaryButton ? renderButton('default', secondaryButton) : null}
    </div>
  );
};

ModalFooter.propTypes = {
  primaryButton: PropTypes.shape({
    ...buttonPropTypes,
    label: PropTypes.node,
  }),
  secondaryButton: PropTypes.shape({
    ...buttonPropTypes,
    label: PropTypes.node,
  }),
};

export default ModalFooter;
