/**
 * Modal Footer
 *
 * This is the default modal footer of a typical <Modal /> in the folio system.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button, { propTypes as buttonPropTypes } from '../Button';

const ModalFooter = ({ primaryButton, secondaryButton }) => {
  // Rendered buttons are identical except for the label and buttonStyle
  const renderButton = (buttonStyle, props) => {
    const { label, ...rest } = props; // eslint-disable-line react/prop-types
    return (<Button {...rest} buttonStyle={buttonStyle} marginBottom0>{label}</Button>);
  };

  return (
    <Fragment>
      {secondaryButton ? renderButton('default', secondaryButton) : null}
      {primaryButton ? renderButton('primary', primaryButton) : null}
    </Fragment>
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
