import React from 'react';
import PropTypes from 'prop-types';
import css from './MultiSelect.css';

const propTypes = {
  ariaLabelledBy: PropTypes.string,
  getInputProps: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
};

const MultiSelectValueInput = ({
  ariaLabelledBy,
  id,
  required,
  getInputProps,
  value,
  ...rest
}) => (
  <input
    {...getInputProps({
      'aria-labelledby': rest['aria-labelledby'] || ariaLabelledBy,
      type: 'text',
      id,
      className: css.multiSelectValueInput,
      required,
      value,
      tabindex: '-1',
    })}
  />
);

MultiSelectValueInput.propTypes = propTypes;

MultiSelectValueInput.defaultProps = {
  required: false,
};

export default MultiSelectValueInput;
