/**
 * Nav List Item
 */

import React, { forwardRef } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import css from './NavListItem.css';
import NavListSectionContext from '../NavListSection/NavListSectionContext';

const NavListItem = forwardRef(({ children, className, isActive, ...rest }, ref) => {
  let Element = 'button';

  if (rest.href) {
    Element = 'a';
  }

  if (rest.to) {
    Element = Link;
  }

  return (
    <NavListSectionContext.Consumer>
      {({ activeLink, striped }) => {
        const active = isActive || activeLink === rest.to || activeLink === rest.href || activeLink === rest.name;
        return (
          <Element
            data-test-nav-list-item
            ref={ref}
            className={
              classnames(
                css.NavListItem,
                { [css.isActive]: active },
                { [css.striped]: striped },
                className
              )
            }
            {...rest}
          >
            {children}
          </Element>
        );
      }}
    </NavListSectionContext.Consumer>
  );
});

NavListItem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]),
  className: PropTypes.string,
  isActive: PropTypes.bool,
};

NavListItem.displayName = 'NavListItem';

export default NavListItem;
