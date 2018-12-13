import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const propTypes = {
  children: PropTypes.node.isRequired,
  selected: PropTypes.bool,
};

function TabButton(props) {
  const { children, selected, ...buttonProps } = props;

  console.warn(
    'Warning: <TabButton> is deprecated and will be removed in the\n' +
    'next major version of @folio/stripes-components.\n\n'
  );

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
