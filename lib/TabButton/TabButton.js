import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const propTypes = {
  children: PropTypes.node.isRequired,
  selected: PropTypes.bool,
};

function TabButton(props) {
  const { children, selected, ...buttonProps } = props;

  return (
    <Button
      buttonStyle={selected ? 'paneHeaderButton tab selected' : 'paneHeaderButton tab'}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}

TabButton.propTypes = propTypes;

export default TabButton;
