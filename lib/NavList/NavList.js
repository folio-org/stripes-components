/**
 * Nav List
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import navListSectionCss from '../NavListSection/NavListSection.css';

const NavList = ({ className, children, ariaLabel, ...rest }) => (
  <nav
    data-test-nav-list
    className={classnames(navListSectionCss.navListSectionControl, className)}
    aria-label={rest['aria-label'] || ariaLabel}
    {...rest}
  >
    {children}
  </nav>
);

NavList.propTypes = {
  ariaLabel: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
};

export default NavList;
