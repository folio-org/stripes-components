import React, { forwardRef } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Headline from '../Headline';
import css from './NavListSection.css';
import NavListSectionContext from './NavListSectionContext';

const NavListSection = forwardRef(({
  activeLink = null,
  children,
  className,
  label,
  tag = 'div',
  striped,
  ...rest
}, ref) => (
  <NavListSectionContext.Provider
    value={{
      activeLink,
      striped
    }}
  >
    <div
      className={classnames(css.root, { [css.striped]: striped }, className)}
      ref={ref}
      data-test-nav-list-section
      {...rest}
    >
      {label && (
        <div className={css.header} data-test-nav-list-section-header>
          <Headline className={css.label} tag={tag}>
            {label}
          </Headline>
        </div>
      )}
      <div className={css.content}>
        {children}
      </div>
    </div>
  </NavListSectionContext.Provider>
));

NavListSection.propTypes = {
  activeLink: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  label: PropTypes.node,
  striped: PropTypes.bool,
  tag: PropTypes.string,
};

NavListSection.displayName = 'NavListSection';

export default NavListSection;
