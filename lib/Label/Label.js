/**
 * Label
 */

import React from 'react';
import PropTypes from 'prop-types';

const Label = ({ children, ...rest }) => {
  return (
    <label {...rest}>
      {children}
    </label>
  );
};

Label.propTypes = {
  children: PropTypes.node,
};

export default Label;
