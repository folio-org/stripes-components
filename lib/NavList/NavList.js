/**
 * Nav List
 */

import React, { forwardRef } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import navListSectionCss from '../NavListSection/NavListSection.css';

const NavList = forwardRef(({ className, children, ariaLabel, ...rest }, ref) => (
  <nav
    data-test-nav-list
    ref={ref}
    className={classnames(navListSectionCss.navListSectionControl, className)}
    aria-label={rest['aria-label'] || ariaLabel}
    {...rest}
  >
    {children}
  </nav>
));

NavList.propTypes = {
  ariaLabel: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
};

NavList.displayName = 'NavList';

export default NavList;
