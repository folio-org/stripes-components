/**
 * Nav List Item
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import css from './NavListItem.css';

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]),
  isActive: PropTypes.bool,
};

const NavListItem = ({ children, className, isActive, ...rest }) => {
  let Element = 'button';
  if (rest.href) {
    Element = 'a';
  }
  if (rest.to) {
    Element = Link;
  }

  return (
    <Element className={classnames(css.NavListItem, { [css.isActive]: isActive }, className)} {...rest}>
      <div className={css.NavListItemInner}>
        {children}
      </div>
    </Element>
  );
};

NavListItem.propTypes = propTypes;

export default NavListItem;
