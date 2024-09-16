/**
 * MenuSection
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import css from './MenuSection.css';
import Headline from '../Headline';

const MenuSection = ({ className, children, id, label, labelTag = 'h1', ...rest }) => {
  const sectionId = id || uniqueId('menu-section-');
  return (
    <section
      id={sectionId}
      className={classNames(css.menuSection, className)}
      aria-labelledby={`${sectionId}-label`}
      {...rest}
      data-test-menu-section
    >
      { label && (
        <Headline
          id={`${sectionId}-label`}
          size="small"
          margin="none"
          tag={labelTag}
          className={css.menuSection__label}
          faded
          data-test-menu-section-label
        >
          {label}
        </Headline>
      )}
      {children}
    </section>
  );
};

MenuSection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.node,
  labelTag: PropTypes.oneOf(['div', 'h2', 'h3', 'h4', 'h5', 'h6'])
};

export default MenuSection;
