import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import Icon from '../Icon';


const DropdownButton = React.forwardRef(({ children, ...buttonProps }, ref) => {
  const iconType = buttonProps['aria-expanded']
    ? 'triangle-up'
    : 'triangle-down';

  return (
    <Button {...buttonProps} ref={ref}>
      <Icon
        icon={iconType}
        size="small"
        iconPosition="end"
      >
        {children}
      </Icon>
    </Button>
  );
});

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
