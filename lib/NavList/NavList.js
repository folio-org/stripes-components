/**
 * Nav List
 */

import React from 'react';
import PropTypes from 'prop-types';

const NavList = ({ className, children, ...rest }) => (
  <nav className={className} {...rest}>
    {children}
  </nav>
);

NavList.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
};

export default NavList;
