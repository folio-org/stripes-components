import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import css from './MultiSelect.css';

const propTypes = {
  autoFocus: PropTypes.bool,
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
  autoFocus,
}) => {
  const inputProps = omit(getInputProps({
    'aria-hidden': true,
    type: 'text',
    id,
    className: css.multiSelectValueInput,
    required,
    value,
    tabIndex: '-1',
    onFocus,
    autoFocus,
  }), ['aria-labelledby']);

  return (<input {...inputProps} />);
};

MultiSelectValueInput.propTypes = propTypes;

MultiSelectValueInput.defaultProps = {
  autoFocus: false,
  required: false,
};

export default MultiSelectValueInput;
