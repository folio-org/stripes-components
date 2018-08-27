/**
 * Nav List Item
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import Icon from '../Icon';
import css from './NavListItem.css';

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]),
  className: PropTypes.string,
  icon: PropTypes.string,
  isActive: PropTypes.bool,
};

const NavListItem = ({ children, className, icon, isActive, ...rest }) => {
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
        { icon ?
          <Icon icon={icon}>
            {children}
          </Icon>
          : children
        }
      </div>
    </Element>
  );
};

NavListItem.propTypes = propTypes;

export default NavListItem;
