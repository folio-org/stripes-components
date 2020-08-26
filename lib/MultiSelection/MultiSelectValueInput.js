import React from 'react';
import PropTypes from 'prop-types';
import css from './MultiSelect.css';

const propTypes = {
  getInputProps: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  onFocus: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.string,
};

const MultiSelectValueInput = ({
  id,
  required,
  getInputProps,
  value,
  onFocus,
}) => {
  const inputProps = getInputProps({
    'aria-hidden': true,
    type: 'text',
    id,
    className: css.multiSelectValueInput,
    required,
    value,
    tabIndex: '-1',
    onFocus
  });

  return (<input {...inputProps} />);
};

MultiSelectValueInput.propTypes = propTypes;

MultiSelectValueInput.defaultProps = {
  required: false,
};

export default MultiSelectValueInput;
