import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Headline from '../Headline';
import css from './NavListSection.css';
import NavListSectionContext from './NavListSectionContext';

const NavListSection = ({
  activeLink,
  children,
  className,
  label,
  striped,
}) => (
  <NavListSectionContext.Provider
    value={{
      activeLink,
      striped
    }}
  >
    <div className={classnames(css.root, { [css.striped]: striped }, className)} data-test-nav-list-section>
      {label && (
        <div className={css.header} data-test-nav-list-section-header>
          <Headline className={css.label}>
            {label}
          </Headline>
        </div>
      )}
      <div className={css.content}>
        {children}
      </div>
    </div>
  </NavListSectionContext.Provider>
);

NavListSection.propTypes = {
  activeLink: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  label: PropTypes.node,
  striped: PropTypes.bool,
};

NavListSection.defaultProps = {
  activeLink: null,
};

export default NavListSection;
