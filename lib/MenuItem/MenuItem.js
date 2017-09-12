import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const MenuItem = props => (<div onClick={props.onClick}> {props.children}</div>);

MenuItem.propTypes = propTypes;

export default MenuItem;
