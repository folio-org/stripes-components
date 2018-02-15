/**
 * Nav List Item
 */

import React from 'react';
import classnames from 'classnames';
import Link from 'react-router-dom/Link';
import AccessibleFocusHoC from '../AccessibleFocus/AccessibleFocusHoC';
import css from './NavListItem.css';

const NavListItem = ({children, className, isActive, ...rest}) => {
  let Element = 'button';
  if (rest.href) {
    Element = 'a';
  }
  if (rest.to) {
    Element = Link;
  }
  return (
      <Element className={classnames(css.NavListItem, {[css.isActive]: isActive} , className)} {...rest}>
        <span>{children}</span>
      </Element>
  );
};

export default AccessibleFocusHoC(NavListItem);
