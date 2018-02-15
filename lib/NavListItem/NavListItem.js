/**
 * Nav List Item
 */

import React from 'react';
import Link from 'react-router-dom/Link';
import AccessibleFocusHoC from '../AccessibleFocus/AccessibleFocusHoC';

const NavListItem = ({children, ...rest}) => {
  const Element = rest.href ? Link : 'button';
  return (
      <Element {...rest}>
        <span>{children}</span>
      </Element>
  );
};

export default AccessibleFocusHoC(NavListItem);
