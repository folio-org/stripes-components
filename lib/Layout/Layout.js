import React from 'react';
import PropTypes from 'prop-types';
import css from './Layout.css';

function Layout({ className, children, element, ...rest }) {
  const Element = element;

  function getClassName() {
    const classString = className;
    const classArray = classString.split(' ');
    const scopedArray = classArray.map(c => css[c]);
    return scopedArray.join(' ');
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

Layout.defaultProps = {
  element: 'div',
};

export default Layout;
