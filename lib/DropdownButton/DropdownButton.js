import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import Icon from '../Icon';


const DropdownButton = (props) => {
  const {
    children: buttonContent,
    ...buttonProps
  } = props;

  const iconType = props.open
    ? 'triangle-up'
    : 'triangle-down';

  return (
    <Button {...buttonProps}>
      <Icon
        icon={iconType}
        size="small"
        iconPosition="end"
      >
        {buttonContent}
      </Icon>
    </Button>
  );
};

DropdownButton.propTypes = {
  align: PropTypes.string,
  buttonClass: PropTypes.string,
  buttonStyle: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  fullWidth: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  paddingSide0: PropTypes.bool,
};

export default DropdownButton;
