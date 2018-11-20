/**
 * MenuSection
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import css from './MenuSection.css';
import Headline from '../Headline';

const MenuSection = ({ className, children, label, ...rest }) => (
  <div className={classNames(css.menuSection, className)} {...rest}>
    { label && (
      <Headline
        size="small"
        margin="none"
        className={css.menuSection__label}
        faded
      >
        {label}
      </Headline>
    )}
    {children}
  </div>
);

MenuSection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.node,
};

export default MenuSection;
