import React from 'react';
import PropTypes from 'prop-types';
import css from './Layout.css';

function Layout({ className, children, element = 'div', ...rest }) {
  const Element = element;

  function getClassName() {
    if (!className) {
      return undefined;
    }
    return className.split(' ').map(c => css[c] || c).join(' ');
  }

  return (
    <Element
      data-test-layout
      className={getClassName()}
      {...rest}
    >
      {children}
    </Element>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  element: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

export default Layout;
