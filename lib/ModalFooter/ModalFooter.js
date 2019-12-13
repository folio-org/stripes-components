/**
 * Modal Footer
 *
 * This is the default modal footer of a typical <Modal /> in the folio system.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { deprecated } from 'prop-types-extra';
import Button, { propTypes as buttonPropTypes } from '../Button/Button';
import css from './ModalFooter.css';

const ModalFooter = ({ children, primaryButton, secondaryButton }) => {
  // Rendered buttons are identical except for the label and buttonStyle
  const renderButton = (buttonStyle, props) => {
    const { label, ...buttonProps } = props; // eslint-disable-line react/prop-types
    return (
      <Button
        {...buttonProps}
        buttonStyle={buttonStyle}
      >
        {label}
      </Button>
    );
  };

  return (
    <div className={css.modalFooterButtons}>
      {primaryButton ? renderButton('primary', primaryButton) : null}
      {secondaryButton ? renderButton('default', secondaryButton) : null}
      {children}
    </div>
  );
};

ModalFooter.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.objectOf(PropTypes.node),
  ]),
  primaryButton: deprecated(PropTypes.shape({
    ...buttonPropTypes,
    label: PropTypes.node,
  }), 'Pass in children instead.'),
  secondaryButton: deprecated(PropTypes.shape({
    ...buttonPropTypes,
    label: PropTypes.node,
  }), 'Pass in children instead.'),
};

export default ModalFooter;
